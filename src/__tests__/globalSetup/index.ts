
import axios from "axios";
import {
  machines,
  companies,
} from "./dummyData/index.js"
import { IData } from "../../interfaces.mjs";
import { COLLECTIONS } from "../../consts.mjs";
import { API_TOKEN } from "../config.js";

const API_URL = `https://${process.env.MONGO_HOST_NAME}${process.env.MONGO_PATH}`;

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Request-Headers": "*",
  'api-key': process.env.MONGO_DATA_API_KEY,
};

const postBody = {
  "database": process.env.MONGO_DATABASE,
  "dataSource": process.env.MONGO_DATASOURCE
};

const deleteMany = (collection: string) => axios.post(`${API_URL}deleteMany`,
  {
    ...postBody, collection,
    filter: {}
  }, {
  headers
});

const insertMany = (collection: string, documents: IData) => axios.post(`${API_URL}insertMany`,
  {
    ...postBody, collection,
    documents,
  }, {
  headers
});

const deleteAllCollectionsDocs = () =>
  [
    deleteMany(COLLECTIONS.companies),
    deleteMany(COLLECTIONS.machines),
  ]

// https://github.com/jestjs/jest/issues/7184
const addGlobalySharableData = async () => {

  // Put any resuable data from the test database in env variable (`globalTestData` here) 
  // & get the data in any test file from it with JSON.parse();
  const { data: { document: theTestCompany } } = await axios.post(`${API_URL}findOne`,
    {
      ...postBody, collection: COLLECTIONS.companies,
      filter: { apiToken: API_TOKEN }
    }, { headers });

  const globalData = {
    companyId: theTestCompany._id
  };

  process.env.globalTestData = JSON.stringify(globalData);
}

export async function setup() {
  console.log("Setting up test database...");

  try {
    console.log("Deleting all documents from the test database collection...");
    await Promise.all(deleteAllCollectionsDocs());
    console.log("Done!");

    console.log("Inserting dummy data for testing...");
    await Promise.all(
      [
        insertMany(COLLECTIONS.machines, machines),
        insertMany(COLLECTIONS.companies, companies),
      ]);
    console.log("Done!");

    console.log("Adding any globally shareable data...");
    await addGlobalySharableData();
    console.log("Done!");
  }
  catch (e) {
    console.log("Some error occurred during global setup", e);
  }
};

export async function teardown() {
  console.log("Tearing down the test database...");
  try {
    console.log("Deleting documents from all the collections...");
    await Promise.all(deleteAllCollectionsDocs());
    console.log("Done!");
  }
  catch (e) {
    console.log("Some error occurred during global teardown", e);
  }
}