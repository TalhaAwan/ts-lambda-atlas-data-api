import { test, expect, describe } from "vitest";
import { handler } from "../../../index.mjs";
import {
  API_TOKEN,
} from "../../config";
import { IParams } from "../../../interfaces.mjs";

const event = {
  headers: {
    "x-api-token": API_TOKEN
  },
  path: "/parts",
  httpMethod: "POST",
  body: {
    abc: ""
  },
  queryStringParameters: { type: undefined },
  pathParameters: { id: "" }
} as IParams

describe.concurrent("Auth & Validation", () => {
  test("Invalid API key/token", async () => {
    //@ts-ignore
    expect(await handler({ ...event, headers: {} })).toStrictEqual({
      statusCode: 400, body: JSON.stringify({ message: "Invalid 'apiToken'" })
    });
  });

  test("Invalid PATCH request without path id", async () => {
    //@ts-ignore
    expect(await handler({ ...event, httpMethod: "PATCH" })).toStrictEqual({
      statusCode: 400, body: JSON.stringify({ message: "Missing resource 'id' in path" })
    });
  });

  test("Wrong/unauthoirzed company API token", async () => {
    //@ts-ignore
    expect(await handler({ ...event, headers: { "x-api-token": "some-wrong-api" } })).toStrictEqual({ statusCode: 401, body: JSON.stringify({ message: "Unauthorized 'apiToken'" }) });
  });

  test("Error on empty request body", async () => {
    //@ts-ignore
    expect(await handler({ ...event, body: undefined })).toStrictEqual({ statusCode: 400, body: JSON.stringify({ message: "Invalid data. Empty body." }) });
  });

  test("Error on non-JSON body", async () => {
    //@ts-ignore
    expect(await handler({ ...event, body: "some string" })).toStrictEqual({ statusCode: 400, body: JSON.stringify({ message: "Invalid data. The body is incorrect JSON." }) });
  });
});

