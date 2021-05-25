# Revoke request

### Request

DELETE `/intel-api/v1/clients/:clientId`

Request headers:

- `X-Credentials` header must have the client ID - API key pair encoded as follows: `base64('<CLIENT ID>' + ':' + '<API KEY>')`

### Response

Format: JSON

- `code`: 204 | 500
- `error`?: object
  - `message`: string
  - `reason`: string
