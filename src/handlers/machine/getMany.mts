import { count, find } from "../../mongoClient.mjs";
import { IQueryStringParameters } from "../../interfaces.mjs";
import { COLLECTIONS, PAGE_LIMIT } from "../../consts.mjs";

const collection = COLLECTIONS.machines;

const projection = {
  _id: 0,
  name: 1,
  description: 1,
  serialCode: 1,
  createdAt: 1,
  updatedAt: 1
};

export const getMany = async ({ companyId, queryStringParameters }:
  { companyId: string, queryStringParameters: IQueryStringParameters }) => {
  let { page } = queryStringParameters || {};
  let skip = 0;
  if (page && !isNaN(page) && page >= 2) {
    page = Math.round(page);
    skip = PAGE_LIMIT * (page - 1);
  }
  else {
    page = 1;
  }

  const filter = {
    deleted: false,
    company: { $oid: companyId }
  }

  try {
    const query = {
      collection,
      filter,
      sort: { updatedAt: -1 },
      limit: PAGE_LIMIT,
      skip,
      projection
    };

    const [total, machines] = await Promise.all([
      count({
        collection,
        filter,
      }),
      find(query)
    ]);

    if (!machines) {
      return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: machines, page: page || 1, totalPages: Math.ceil(total / PAGE_LIMIT) })
    };
  }
  catch (e) {
    console.log("Something went wrong in getMany", e);
    return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
  }
};
