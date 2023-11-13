import { validateIdentifier } from "../../validator.mjs";
import { findOne } from "../../mongoClient.mjs";
import { COLLECTIONS } from "../../consts.mjs";
import { IMachine } from "../../interfaces.mjs";

const collection = COLLECTIONS.machines;

const projection = {
  _id: 0,
  name: 1,
  description: 1,
  serialCode: 1,
  createdAt: 1,
  updatedAt: 1
};

export const get = async ({ companyId, id }: { companyId: string, id: string }) => {
  try {
    const serialCodeIdentifier = validateIdentifier(id, "serialCode");
    if (!serialCodeIdentifier.isValid) {
      return { statusCode: 400, body: JSON.stringify({ message: serialCodeIdentifier.message, errors: serialCodeIdentifier.errors }) };
    }

    const query = {
      collection,
      filter: {
        serialCode: id,
        deleted: false,
        company: { $oid: companyId }
      },
      projection
    };

    const machine: IMachine = await findOne(query);

    if (!machine) {
      return { statusCode: 404, body: JSON.stringify({ message: "Resource not found" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ data: machine }) };
  }
  catch (e) {
    console.log("Something went wrong in MachineController `getOneById`", e);
    return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
  }
};
