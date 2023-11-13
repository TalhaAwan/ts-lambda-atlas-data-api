const identifierSchema = { type: "string", minLength: 1, maxLength: 50 };

const machineSchema = {
  type: "object",
  properties: {
    serialCode: { type: "string", minLength: 1, maxLength: 50 },
    name: { type: "string", minLength: 1 },
    description: { type: "string" }
  },
  additionalProperties: false
};

const machineSchemaCreate = {
  ...machineSchema,
  required: ["serialCode", "name"],
};

const machineSchemaUpdate = {
  ...machineSchema,
};

export {
  identifierSchema,
  machineSchemaCreate,
  machineSchemaUpdate
}