import { COLLECTIONS } from "./consts.mjs";
import { findOne } from "./mongoClient.mjs";



const authenticateAndGetCompany = async (apiToken: string) => {
  return await findOne({
    collection: COLLECTIONS.companies, filter: { apiToken },
    projection: { _id: 1, name: 1 }
  });
};

const getCurrentDateTime = () => ({ "$date": new Date() })

const getCreateDocumentDefaultData = () => {
  const currentDateTime = getCurrentDateTime();

  return {
    createdAt: currentDateTime,
    updatedAt: currentDateTime,
    deleted: false,
  }
};

const getUpdateDocumentDefaultData = () => {
  return {
    updatedAt: getCurrentDateTime()
  }
};

export {
  authenticateAndGetCompany,
  getCreateDocumentDefaultData,
  getUpdateDocumentDefaultData,
  getCurrentDateTime,
};
