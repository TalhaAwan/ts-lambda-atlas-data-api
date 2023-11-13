import { validateInputData, validateIdentifier } from "../../validator.mjs";
import { machineSchemaCreate } from "../../schemas.mjs";
import { insertOne, findOne } from "../../mongoClient.mjs";
import {
  getCreateDocumentDefaultData,
} from "../../helper.mjs"
import { IMachine, IMachineCreateData } from "../../interfaces.mjs";
import { COLLECTIONS } from "../../consts.mjs";

const collection = COLLECTIONS.machines;

export const create = async ({ companyId, data }:
  { companyId: string, data: IMachineCreateData }) => {
  try {
    const serialCodeIdentifier = validateIdentifier(data.serialCode, "serialCode");
    if (!serialCodeIdentifier.isValid) {
      return { statusCode: 400, body: JSON.stringify({ message: serialCodeIdentifier.message, errors: serialCodeIdentifier.errors }) };
    }

    const machine: IMachine = await findOne({
      collection,
      filter: { serialCode: data.serialCode, company: { $oid: companyId }, deleted: false },
      projection:
      {
        _id: 1,
        name: 1,
        serialCode: 1,
      }
    });

    if (machine) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: `Record already exists for id ${data.serialCode}` })
      }
    }

    const machineValidation = validateInputData(machineSchemaCreate, data);

    if (!machineValidation.isValid) {
      return { statusCode: 400, body: JSON.stringify({ message: machineValidation.message, errors: machineValidation.errors }) };
    }

    await insertOne({
      collection,
      data: {
        ...data,
        company: { $oid: companyId },
        ...getCreateDocumentDefaultData(),
      }
    });

    return { statusCode: 200, body: JSON.stringify({ message: `Machine created successfully!`, data: { serialCode: data.serialCode } }) };
  }
  catch (e) {
    console.log("Something went wrong in MachineController `create`", e);
    return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
  }
};
