# DESCRIPTION
Typescript code for AWS lambda, using Mongo Atlas Data API, with unit & integration tests, build scripts, and API documentation. It contains CRUD operations for a dummy "machines" collection. 

# DOCUMENTATION
- [Requirements](#requirements)
- [Test Environment](#test-environment)
- [Setup](#setup)
- [Run Tests](#run-tests)
- [Deploy to Lambda](#deploy-to-lambda)
- [Generate API Documentation](#generate-api-documentation)
- [Build and Deploy the AWS Layer](#build-and-deploy-the-aws-layer)


## Requirements:
- Node version >= v16.16.0
- [Mongo Atlas Data API Key](https://www.mongodb.com/docs/atlas/app-services/data-api/) to connect with Mongo database restfully from lambda function
- To run the tests, add `.env.test` with data in the root

## Test Environment
Add the following variables in the `.env.test` with your valid to run the tests. Replace the example values with your info: 

```
MONGO_DATABASE=example-database
MONGO_DATASOURCE=example-datasource
MONGO_DATA_API_KEY=MnaLFftBeDzjhBDFlFxTDSABsCTjkQ7HqnszGYvcrPFRUIIcH2KBKmab1im7xyZi
MONGO_HOST_NAME=eu-central-1.aws.data.mongodb-api.com
MONGO_PATH=/app/data-mrpbb/endpoint/data/v1/action/
```

## Setup
```
npm i
```

## Run tests
```
npm test
```

## Run lambda handler locally

```
npm run execLocal
```

This command will run the handler function locally, by running the playground file `src/local.mts`.  Add proper parameters expected by the handler to simulate the lambda function correctly.

## Deploy to Lambda

### Manually

To deploy manually, run this command:
```
npm run build
```

and upload the generated `dist.zip` file on AWS lambda through the web interface. It will deploy the latest compiled JS code to the lambda.

### Automatically via Github workflow

In the GitHub repository add environment variables and secrets as mentioned in this workflow file `.github/workflows/deploy-lambda.yml`:

Secrets:
```
AWS_ACCESS_KEY
AWS_SECRET_KEY
MONGO_DATA_API_KEY
```

Variables:
```
AWS_REGION
MONGO_HOST_NAME
MONGO_PATH
MONGO_DATABASE
MONGO_DATASOURCE
LAMBDA_NAME
```

The workflow deploys the latest build to the lambda on a successful test run. This workflow assumes three Github environments "Production", "Staging" and "Development" against the branches "main", "staging", and "dev" respectively. 

## Generate API Documentation

Modify files under `src/docs` to change the API documentation. In this project, we're using [APIDOC](https://apidocjs.com/). Its configuration file is available as `apidoc.json`.

To generate the docs build run:

```
npm run build:doc
```

Deploy the generated docs folder (`apidoc`) as a static site anywhere (such as Netlify). Or open the index.html file locally.

## Build and Deploy the AWS Layer

For efficient use of Lambda functions, it is suggested to deploy and use the packages separately as AWS layers. To do, generate the layer with the following command:

```
npm run build:aws-layer
```

This will generate a zip file by the name of `nodejs`, containing only the dependencies of this project (omitting devDependencies). Create an AWS layer, upload this zip file there, and connect it with your lambda. For any future change in the dependencies follow the same step and upload the new version of the layer for new packages to be available to your lambda.
