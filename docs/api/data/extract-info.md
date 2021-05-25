# Extract info

### Request

POST `/intel-api/v1/data/extract-info`

Request body:

- `content`: file data
- `keywords`?: object (`topic name`: `list<string of keywords/regular expressions>`)

Request headers:

- `X-Credentials` header must have the client ID - API key pair encoded as follows: `base64('<CLIENT ID>' + ':' + '<API KEY>')`
- Headers as required by provider

### Response

Format: JSON

- `code`: 201 | 400 | 401 | 403 | 404 | 500 | 501
- `error`?: object
  - `message`: string
  - `reason`: string
- `content`?: object
  - `topics`: object (`topic name`: `list<string of filenames containing that topic`)
  - `people`: object (`email addr`: `list<string of filenames containing that email`)
