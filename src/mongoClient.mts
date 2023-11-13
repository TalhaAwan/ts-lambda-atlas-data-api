import * as https from "https";
import { defaultOptions, postBody } from "./config.mjs";
import {
  IResponse,
  IReseponseUpdateOne,
  IResponseFindOne,
  IResponseFind,
  IResponseInsertOne,
  IProjection,
  IData,
  IFilter,
  IPostParams,
  IResponseCount
} from "./interfaces.mjs"

const post = ({ collection, action, data, update, filter, pipeline, limit, skip, sort, projection }:
  IPostParams): IResponse => {
  const options = {
    ...defaultOptions,
    path: defaultOptions.path + action
  };

  return new Promise((resolve, reject) => {
    const req = https
      .request(options, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve(JSON.parse(body))
        });
      })
      .on("error", reject);
    req.write(JSON.stringify({
      ...postBody,
      collection,
      filter: filter ?? undefined,
      limit: limit ?? undefined,
      skip: skip ?? undefined,
      sort: sort ?? undefined,
      document: data ?? undefined,
      projection: projection ?? undefined,
      pipeline: pipeline ?? undefined,
      update: update ?? undefined
    }));

    req.end();
  });
};

const count = async ({ collection, filter }:
  { collection: string, filter: IFilter }) => {
  const pipeline = [
    {
      "$match": filter
    },
    {
      "$group": {
        "_id": null,
        "count": { "$sum": 1 },
      }
    },
  ]
  const result = await post({ collection, action: "aggregate", pipeline }) as IResponseCount;

  if (!result || !result.documents) {
    console.log("Some error occured during 'aggregate' query", JSON.stringify({ collection, action: "aggregate", filter }), result);
    throw new Error();
  }

  return result?.documents?.length ? result?.documents[0].count : 0;

}

const findOne = async ({ collection, filter, projection }:
  { collection: string, filter: IFilter, projection: IProjection }) => {
  const result = await post({ collection, action: "findOne", filter, projection }) as IResponseFindOne;
  if (!result || result.document === undefined) {
    console.log("Some error occured during 'findOne' query", JSON.stringify({ collection, action: "findOne", filter, projection }), result);
    throw new Error();
  }
  return result.document;
}

const find = async ({ collection, filter, limit, skip, sort, projection }:
  { collection: string, filter: IFilter, limit?: number, skip?: number, sort?: { [x: string]: number }, projection: IProjection }) => {
  const result = await post({ collection, action: "find", filter, limit, skip, sort, projection }) as IResponseFind;
  if (!result.documents) {
    console.log("Some error occured during 'find' query", JSON.stringify({ collection, action: "find", filter, projection }), result);
    throw new Error();
  }
  return result.documents;
}

const insertOne = async ({ collection, data }:
  { collection: string, data: IData }) => {
  const result = await post({ collection, action: "insertOne", data }) as IResponseInsertOne;
  if (typeof result === "string") throw new Error(result);
  if (!result.insertedId) {
    console.log("Some error occured during 'insertOne' query", JSON.stringify({ collection, action: "insertOne", data }), result);
    throw new Error();
  }
  return result.insertedId;
}

const updateOne = async ({ collection, filter, data, pushData }:
  { collection: string, filter: IFilter, data: IData, pushData?: IData }) => {
  const update = {
    "$set": data,
    "$push": pushData ?? undefined
  }
  const result = await post({ collection, action: "updateOne", filter, update }) as IReseponseUpdateOne;
  if (typeof result === "string") throw new Error(result);
  if (result.matchedCount === undefined) {
    console.log("Some error occured during 'updateOne' query", JSON.stringify({ collection, action: "updateOne", filter, update }), result);
    throw new Error();
  }
  return result;
}

export { findOne, find, insertOne, updateOne, count };
