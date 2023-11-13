interface IParams {
  headers: {
    "x-api-token": string
  },
  httpMethod: typeHttpMethod,
  body: IData,
  queryStringParameters: IQueryStringParameters,
  pathParameters: IPathParameters
};

type typeHttpMethod = "GET" | "POST" | "PATCH";

interface IQueryStringParameters {
  page?: number
}

interface IPathParameters {
  id?: string
}

interface IResponseFindOne {
  document: IMachine
}

interface IResponseFind {
  documents: [IMachine]
}

interface IResponseCount {
  documents: { _id: null; count: number }[]
}

interface IResponseInsertOne {
  insertedId: string
}

interface IReseponseUpdateOne {
  matchedCount: number;
  modifiedCount: number;
  upsertedId?: string
}

type IResponse = IResponseFindOne | IResponseInsertOne | Promise<unknown>;

interface IFilter {
  [x: string]: any
}

interface IData {
  [x: string]: any
}

interface IUpdate {
  [x: string]: any
}

interface IMachineCreateData {
  name: string,
  serialCode: string,
  description?: string
};

interface IMachineUpdateData {
  name: string,
  description?: string
};

interface IMachine {
  _id: string,
  name: string,
  company: string;
  deleted: boolean;
  serialCode: string,
  description: string,
  createdAt: string,
  updatedAt: string
};

interface IMachineBulkCreate {
  name: string,
  company: {
    $oid: string
  };
  deleted: boolean;
  serialCode: string,
  description: string,
  createdAt: {
    $date: Date
  },
  updatedAt: {
    $date: Date
  }
};

interface IProjection {
  [x: string]: number | string
}

interface IPostParams {
  collection: string,
  action: action,
  data?: IData,
  pipeline?: IData,
  update?: IUpdate,
  filter?: IFilter,
  limit?: number,
  skip?: number,
  sort?: {
    [x: string]: number
  }
  projection?: IProjection
}

type action = "findOne" | "find" | "insertOne" | "updateOne" | "aggregate";

export {
  IParams,
  IResponse,
  IResponseInsertOne,
  IResponseFindOne,
  IResponseFind,
  IResponseCount,
  IReseponseUpdateOne,
  IQueryStringParameters,
  IFilter,
  IData,
  IUpdate,
  IProjection,
  IPostParams,
  action,
  typeHttpMethod,
  IMachineCreateData,
  IMachineUpdateData,
  IMachine,
  IMachineBulkCreate
};