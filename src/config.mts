if (!process.env.MONGO_DATA_API_KEY) {
  await import('dotenv/config'); // to import environment locally
}

const defaultOptions = {
  protocol: 'https:',
  hostname: process.env.MONGO_HOST_NAME,
  port: 443,
  method: 'POST',
  path: process.env.MONGO_PATH,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Request-Headers": "*",
    'api-key': process.env.MONGO_DATA_API_KEY,
  }
};

const postBody = {
  "database": process.env.MONGO_DATABASE,
  "dataSource": process.env.MONGO_DATASOURCE
};

export {
  defaultOptions,
  postBody,
};