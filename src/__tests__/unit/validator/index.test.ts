import { test, expect, describe } from "vitest";
import {
  validateIdentifier,
  validateInputData
} from "../../../validator.mjs"

describe("Validator", () => {
  describe.concurrent("validateIdentifier", () => {
    test("isValid false ", async () => {
      //@ts-ignore
      const result = validateIdentifier(7, "serialCode");
      expect(result.isValid).toBe(false);
      expect(result.message).toStrictEqual(`Invalid identifier 'serialCode'`);
      expect(result?.errors?.length).toBeGreaterThan(0);
    });
    test("isValid true ", async () => {
      //@ts-ignore
      const result = validateIdentifier("7", "serialCode");
      expect(result.isValid).toBe(true);
    });
  });

  describe.concurrent("validateInputData", () => {
    const someSchema = {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, maxLength: 50 },
        name: { type: "string", minLength: 1 },
        description: { type: "string", maxLength: 50 },
        mongoRef: { "type": ["string", "null"], minLength: 1, maxLength: 50 },
      },
      additionalProperties: false
    };

    test("isValid false ", async () => {
      //@ts-ignore
      const result = validateInputData(someSchema, {
        id: "777",
        name: 7
      });
      expect(result.isValid).toBe(false);
      expect(result.message).toStrictEqual("Invalid input");
      expect(result?.errors?.length).toBeGreaterThan(0);

      //@ts-ignore
      const result2 = validateInputData(someSchema, {
        id: "777",
        name: "Name",
        description: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 abcdefghijklmnopqrstuvwxyz" // > 50
      });
      expect(result2.isValid).toBe(false);
      expect(result2.message).toStrictEqual("Invalid input");
      expect(result2?.errors?.length).toBeGreaterThan(0);
    });

    test("isValid true ", async () => {
      //@ts-ignore
      const result = validateInputData(someSchema, {
        id: "123",
        name: "7",
        description: "abc",
        mongoRef: null
      });
      expect(result.isValid).toBe(true);
    });
  });
});