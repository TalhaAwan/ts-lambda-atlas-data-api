import { authenticateAndGetCompany } from "./helper.mjs";
import { create } from "./handlers/machine/create.mjs";
import { update } from "./handlers/machine/update.mjs";
import { get } from "./handlers/machine/get.mjs";
import { getMany } from "./handlers/machine/getMany.mjs";
import { IParams } from "./interfaces.mjs";

export const handler = async ({ headers, httpMethod, body, queryStringParameters, pathParameters }: IParams) => {
  try {
    const { id } = pathParameters || {};
    const xApiToken = headers["x-api-token"];
    const isHttpGet = httpMethod === "GET";
    const isHttpPost = httpMethod === "POST";
    const isHttpPatch = httpMethod === "PATCH";

    if (!xApiToken) {
      return { statusCode: 400, body: JSON.stringify({ message: "Invalid 'apiToken'" }) };
    }

    if (isHttpPatch && !id) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing resource 'id' in path" }) };
    }

    const authenticatedCompany = await authenticateAndGetCompany(xApiToken);

    if (!authenticatedCompany) {
      return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized 'apiToken'" }) };
    };

    const companyId: string = authenticatedCompany._id;

    if ((isHttpPost || isHttpPatch) && !body) {
      return { statusCode: 400, body: JSON.stringify({ message: "Invalid data. Empty body." }) };
    }

    let data;

    if (!isHttpGet) {
      try {
        data = JSON.parse(body as unknown as string);
      }
      catch (e) {
        console.log("Invalid request body JSON", e);
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid data. The body is incorrect JSON." }) };
      }
    }

    if (isHttpGet) {
      if (id) {
        return await get({ companyId, id });
      } else {
        return await getMany({ companyId, queryStringParameters });
      }
    }
    else if (isHttpPost) {
      return await create({ companyId, data });
    }
    else if (isHttpPatch && id) {
      return await update({ companyId, data, id });
    }
    else {
      return { statusCode: 400, body: JSON.stringify({ message: "Invalid call" }) };
    }

  }
  catch (e) {
    console.log("Something went wrong in handler", e);
    return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
  }
};
