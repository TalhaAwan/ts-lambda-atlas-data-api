// A script to run and test the code locally

import { handler } from "./index.mjs";
const API_TOKEN = "008c8a16-5b3e-4ada-aa8b-388799d63a4b";

const result = await handler({
  headers: {
    "x-api-token": API_TOKEN
  },
  httpMethod: "POST",
  body: {
    name: "Machine 1"
  },
  queryStringParameters: {},
  pathParameters: { id: "" }
})

console.log(result);