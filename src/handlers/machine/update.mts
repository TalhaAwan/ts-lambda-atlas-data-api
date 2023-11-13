import { validateInputData, validateIdentifier } from "../../validator.mjs";
import { machineSchemaUpdate } from "../../schemas.mjs";
import { findOne, updateOne } from "../../mongoClient.mjs";
import {
  getUpdateDocumentDefaultData,
} from "../../helper.mjs"
import { IMachine, IMachineUpdateData } from "../../interfaces.mjs";
import { COLLECTIONS } from "../../consts.mjs";

const collection = COLLECTIONS.machines;

export const update = async ({ companyId, data, id }:
  { companyId: string, data: IMachineUpdateData, id: string }) => {
  try {
    const serialCode = id;
    const serialCodeIdentifier = validateIdentifier(serialCode, "serialCode");
    if (!serialCodeIdentifier.isValid) {
      return { statusCode: 400, body: JSON.stringify({ message: serialCodeIdentifier.message, errors: serialCodeIdentifier.errors }) };
    }

    const filter = { serialCode: serialCode, company: { $oid: companyId }, deleted: false };

    const machine: IMachine = await findOne({
      collection,
      filter,
      projection:
      {
        _id: 1,
        name: 1,
        serialCode: 1,
      }
    });

    if (!machine) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `No record found to update for id ${serialCode}` })
      }
    }

    const machineValidation = validateInputData(machineSchemaUpdate, data);

    if (!machineValidation.isValid) {
      return { statusCode: 400, body: JSON.stringify({ message: machineValidation.message, errors: machineValidation.errors }) };
    }

    await updateOne({
      collection,
      filter,
      data: {
        ...data,
        company: { $oid: companyId },
        ...getUpdateDocumentDefaultData(),
      }
    });

    return { statusCode: 200, body: JSON.stringify({ message: `Machine updated successfully!`, data: { serialCode } }) };
  }
  catch (e) {
    console.log("Something went wrong in MachineController `update`", e);
    return { statusCode: 500, body: JSON.stringify({ message: "Something went wrong" }) };
  }
};
