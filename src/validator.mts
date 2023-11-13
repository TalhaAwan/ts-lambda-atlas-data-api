import jsonschema from "jsonschema";
import { identifierSchema } from "./schemas.mjs";

const Validator = jsonschema.Validator;
const v = new Validator();

const validateIdentifier = (id?: string, idName?: string) => {
  const { errors } = v.validate(id, identifierSchema, { required: true });
  if (errors.length) {
    return {
      isValid: false,
      message: `Invalid identifier '${idName}'`,
      errors: errors.map(e => e.stack)
    }
  }
  return { isValid: true }
}

const validateInputData = (validationScehma: { [x: string]: any }, data: { [x: string]: any }) => {
  const { errors } = v.validate(data, validationScehma, { required: true });

  if (errors.length) {
    return {
      isValid: false,
      message: "Invalid input",
      errors: errors.map(e => e.stack)
    }
  }
  return {
    isValid: true
  };
};

export {
  validateIdentifier,
  validateInputData,
};
