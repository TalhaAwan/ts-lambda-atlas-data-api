/**
 * @api {post} /machines Create Machine
 * @apiHeader {String} x-api-key
 * @apiHeader {String} x-api-token
 * @apiName Create Machine
 * @apiGroup Machine
 *
 * @apiSuccess {Object} message Success message.
 * @apiSuccess {Object} data Contains `serialCode` of the newly created machine.
 *
 * @apiBody {String} serialCode Unique identifier for the machine.
 * @apiBody {String} name Name of the machine.
 * @apiBody {String} [description] Description of the machine in plain text or in serialized slate.js format.
 * @apiSuccessExample Success Response Examples:
  HTTP/1.1 200 OK
  {
    "message": "Machine created successfully!",
    "data": {
        "serialCode": "machine-1"
    }
  }
 * @apiError (400 Bad Request) [message] Error message. E.g., "Invalid input."
 * @apiError (401 Unauthorized) [message] Error message. E.g., "`x-api-token` is unauthorized."
 * @apiError (403 Forbidden) [message] Error message. E.g., "`x-api-key` is invalid."
 * @apiError (409 Conflict) [message] Error message. E.g., "Record already exists."
 * @apiError (500 Internal Server Error) [message] Error message. E.g., "Something went wrong."
 *
 * @apiErrorExample Error Response Example:
  HTTP/1.1 403 Forbidden
  {
    "message": "Forbidden"
  }
 */

/**
 * @api {patch} /machines/:id Update Machine
 * @apiHeader {String} x-api-key
 * @apiHeader {String} x-api-token
 * @apiName Update Machine
 * @apiGroup Machine
 *
 * @apiParam {String} id Unique machine serial code.
 * 
 * @apiSuccess {Object} message Success message.
 * @apiSuccess {Object} data Contains `serialCode` of the updated machine.
 *
 * @apiBody {String} [serialCode] Unique identifier for the machine.
 * @apiBody {String} [name] Name of the machine.
 * @apiBody {String} [description] Description of the machine in plain text or in serialized slate.js format.
 * @apiSuccessExample Success Response Examples:
  HTTP/1.1 200 OK
  {
    "message": "Machine updated successfully!",
    "data": {
        "serialCode": "machine-1"
    }
  }
 * @apiError (400 Bad Request) [message] Error message. E.g., "Invalid id. Ensure the id is UTF-8 encoded."
 * @apiError (401 Unauthorized) [message] Error message. E.g., "`x-api-token` is unauthorized."
 * @apiError (403 Forbidden) [message] Error message. E.g., "`x-api-key` is invalid."
 * @apiError (409 Conflict) [message] Error message. E.g., "Record already exists."
 * @apiError (500 Internal Server Error) [message] Error message. E.g., "Something went wrong."
 *
 * @apiErrorExample Error Response Example:
  HTTP/1.1 403 Forbidden
  {
    "message": "Forbidden"
  }
 */

/**
 * @api {get} /machines/:id Get Machine Details
 * @apiHeader {String} x-api-key
 * @apiHeader {String} x-api-token
 * @apiName Get Machine Details
 * @apiGroup Machine
 * 
 * @apiParam {String} id Unique machine serial code.
 *
 * @apiSuccess {Object} data Machine object.
 *
 * @apiSuccessExample Success Response Examples:
  HTTP/1.1 200 OK
  {
    "data": {
      "name": "Machine 1",
      "description": "Machine 1 description",
      "serialCode": "machine-1",      
      "createdAt": "2023-11-11T11:11:57.38Z",
      "updatedAt": "2023-11-11T11:11:57.38Z",
    }
  }
 * @apiError (400 Bad Request) [message] Error message. E.g., "Invalid id. Ensure the id is UTF-8 encoded."
 * @apiError (401 Unauthorized) [message] Error message. E.g., "`x-api-token` is unauthorized."
 * @apiError (403 Forbidden) [message] Error message. E.g., "`x-api-key` is invalid."
 * @apiError (500 Internal Server Error) [message] Error message. E.g., "Something went wrong."
 *
 * @apiErrorExample Error Response Example:
  HTTP/1.1 403 Forbidden
  {
    "message": "Forbidden"
  }
 */

/**
 * @api {get} /machines Get Machines List
 * @apiHeader {String} x-api-key
 * @apiHeader {String} x-api-token
 * @apiName Get Machines List
 * @apiGroup Machine
 *
 * @apiSuccess {Object[]} data Array of machine objects; 100 objects per page.
 * @apiSuccess {Number} totalPages Total number of pages.
 * @apiSuccess {Number} page Current page number.
 *
 * @apiSuccessExample Success Response Examples:
  HTTP/1.1 200 OK
  {
    "data": [
      {
        "name": "Machine 1",
        "description": "Machine 1 description",
        "serialCode": "machine-1",
        "createdAt": "2023-11-11T11:11:57.38Z",
        "updatedAt": "2023-11-11T11:11:57.38Z",
      },
      {
        "name": "Machine 2",
        "description": "Machine 2 description",
        "serialCode": "machine-2",
        "createdAt": "2023-11-11T11:11:57.38Z",
        "updatedAt": "2023-11-11T11:11:57.38Z",
      }
    ],
    "totalPages": 1,
    "page": 1,
  }
 *
 * @apiError (401 Unauthorized) [message] Error message. E.g., "`x-api-token` is unauthorized."
 * @apiError (403 Forbidden) [message] Error message. E.g., "`x-api-key` is invalid."
 * @apiError (500 Internal Server Error) [message] Error message. E.g., "Something went wrong."
 *
 * @apiErrorExample Error Response Example:
  HTTP/1.1 403 Forbidden
  {
    "message": "Forbidden"
  }
 */