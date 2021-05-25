# Create request

### Request

POST `/intel-api/v1/clients/`

### Response

Format: JSON

- `code`: 200 | 500
- `error`?: object
  - `message`: string
  - `reason`: string
- `content`?: object
  - `id`: string
  - `apiKey`: string
