import axios from "axios";
import { test, expect, describe, beforeAll } from "vitest";
import { handler } from "../../../index.mjs";
import {
  API_TOKEN,
  FIND_ONE_URL,
  headers,
  postBody,
} from "../../config.js";
import { IParams } from "../../../interfaces.mjs";
import { COLLECTIONS } from "../../../consts.mjs";

const {
  companyId,
} = JSON.parse(process.env.globalTestData as string);

const collection = COLLECTIONS.machines;

const event = {
  headers: {
    "x-api-token": API_TOKEN
  },
  httpMethod: "POST",
  body: {
    abc: ""
  },
  queryStringParameters: { type: undefined },
  pathParameters: { id: "" }
} as IParams

describe.concurrent("Machine", () => {
  const serialCode = "machine-1" + Date.now();

  describe.concurrent("Insert machine", () => {
    describe.concurrent("Success", () => {
      test("Insert machine", async () => {
        const params = {
          ...event,
          body: JSON.stringify({
            serialCode,
            name: "Machine 1"
          })
        };

        //@ts-ignore
        expect(await handler(params)).toStrictEqual({ statusCode: 200, body: JSON.stringify({ message: "Machine created successfully!", data: { serialCode } }) });
        const { data: { document: machine } } = await axios.post(FIND_ONE_URL,
          { ...postBody, collection, filter: { company: { $oid: companyId }, serialCode } }, {
          headers
        });

        expect(machine.serialCode).toBe(serialCode);
      });
    });

    describe.concurrent("Error", () => {
      test("Error on missing 'name' when inserting machine", async () => {
        const params = {
          ...event,
          body: JSON.stringify({
            serialCode: `machine-2`,
          })
        };

        //@ts-ignore
        const { statusCode } = await handler(params)
        expect(statusCode).toBe(400);
      });

      test("Error on missing 'serialCode' when insert machine", async () => {
        const params = {
          ...event,
          body: JSON.stringify({
            name: "Machine 2",
          })
        };

        //@ts-ignore
        const { statusCode } = await handler(params)
        expect(statusCode).toBe(400);
      });
    });
  });

  describe.concurrent("Update machine", () => {
    describe.concurrent("Success", () => {
      test("Update machine", async () => {
        const name = "Machine 1 updated name"
        const params = {
          ...event,
          httpMethod: "PATCH",
          pathParameters: { id: serialCode },
          body: JSON.stringify({
            serialCode,
            name
          })
        };

        //@ts-ignore
        expect(await handler(params)).toStrictEqual({ statusCode: 200, body: JSON.stringify({ message: "Machine updated successfully!", data: { serialCode } }) });
        const { data: { document: machine } } = await axios.post(FIND_ONE_URL,
          { ...postBody, collection, filter: { company: { $oid: companyId }, serialCode } }, {
          headers
        });
        expect(machine.serialCode).toBe(serialCode);
        expect(machine.name).toBe(name);
      });
    });

    describe.concurrent("Error", () => {
      test("Error on wrong 'name' type when inserting machine", async () => {
        const params = {
          ...event,
          httpMethod: "PATCH",
          pathParameters: { id: serialCode },
          body: JSON.stringify({
            name: 7,
          })
        };

        //@ts-ignore
        const { statusCode } = await handler(params)
        expect(statusCode).toBe(400);
      });
    });
  });

  describe.concurrent("Get machine", () => {
    describe.concurrent("Success", () => {
      test("Get machine", async () => {
        const params = {
          ...event,
          pathParameters: { id: serialCode },
          httpMethod: "GET"
        };

        //@ts-ignore
        const result = await handler(params);
        expect(result.statusCode).toBe(200);
        const { data: { document: machine } } = await axios.post(FIND_ONE_URL,
          { ...postBody, collection, filter: { company: { $oid: companyId }, serialCode } }, {
          headers
        });
        expect(machine.serialCode).toBe(serialCode);
      });
    });

    describe.concurrent("Error", () => {
      test("404 when machine not found against the provided id", async () => {
        const params = {
          ...event,
          pathParameters: { id: serialCode + "123" },
          httpMethod: "GET"
        };

        //@ts-ignore
        const { statusCode } = await handler(params)
        expect(statusCode).toBe(404);
      });
    });
  });

  describe.concurrent("Get machines", () => {
    const LIMIT = 100;
    const TOTAL_PAGES = 8;

    describe.concurrent("Success", () => {
      test("Get default page", async () => {
        const params = {
          ...event,
          httpMethod: "GET",
        };

        //@ts-ignore
        const response = await handler(params);

        //@ts-ignore
        const body = JSON.parse(response?.body);
        // 
        const { data, totalPages, page } = body;
        expect(response?.statusCode).toBe(200);
        expect(data.length).toBe(LIMIT);
        expect(totalPages).toBe(TOTAL_PAGES);
        expect(page).toBe(1);
      });

      test("Get page one", async () => {
        const params = {
          ...event,
          httpMethod: "GET",
          queryStringParameters: { page: 1 },
        };

        //@ts-ignore
        const response = await handler(params);

        //@ts-ignore
        const body = JSON.parse(response?.body);
        // 
        const { data, totalPages, page } = body;
        expect(response?.statusCode).toBe(200);
        expect(data.length).toBe(LIMIT);
        expect(totalPages).toBe(TOTAL_PAGES);
        expect(page).toBe(1);
      });

      test("Get page two", async () => {
        const params = {
          ...event,
          httpMethod: "GET",
          queryStringParameters: { page: 2 },
        };

        //@ts-ignore
        const response = await handler(params);

        //@ts-ignore
        const body = JSON.parse(response?.body);

        const { data, totalPages, page } = body;
        expect(response?.statusCode).toBe(200);
        expect(data.length).toBe(LIMIT);
        expect(totalPages).toBe(TOTAL_PAGES);
        expect(page).toBe(2);
      });

      test("Get page eight", async () => {
        const params = {
          ...event,
          httpMethod: "GET",
          queryStringParameters: { page: 8 },
        };

        //@ts-ignore
        const response = await handler(params);

        //@ts-ignore
        const body = JSON.parse(response?.body);

        const { data, totalPages, page } = body;
        expect(response?.statusCode).toBe(200);
        expect(data.length).toBeGreaterThanOrEqual(70);
        expect(data.length).toBeLessThan(100);
        expect(totalPages).toBe(TOTAL_PAGES);
        expect(page).toBe(8);
      });

      test("Get page nine", async () => {
        const params = {
          ...event,
          httpMethod: "GET",
          queryStringParameters: { page: 9 },
        };

        //@ts-ignore
        const response = await handler(params);

        //@ts-ignore
        const body = JSON.parse(response?.body);

        const { data, totalPages, page } = body;
        expect(response?.statusCode).toBe(200);
        expect(data.length).toBe(0);
        expect(totalPages).toBe(TOTAL_PAGES);
        expect(page).toBe(9);
      });
    });
  });
});
