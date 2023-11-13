import {
  companies,
} from "./globalSetup/dummyData/index.js";

const API_URL = `https://${process.env.MONGO_HOST_NAME}${process.env.MONGO_PATH}`;
const FIND_ONE_URL = `${API_URL}findOne`;
const API_TOKEN = companies[0].apiToken;

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Request-Headers": "*",
  'api-key': process.env.MONGO_DATA_API_KEY,
};

const postBody = {
  "database": process.env.MONGO_DATABASE,
  "dataSource": process.env.MONGO_DATASOURCE
};

export {
  headers,
  postBody,
  API_TOKEN,
  FIND_ONE_URL
};