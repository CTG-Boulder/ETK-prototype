# ETK Prototype

Contact tracing server prototype.

## Usage / Verification flow

All API responses come in the form:

```json
{
  "data": {},
  "errors": [] // usually empty but can contain errors
}
```

### Errors

An error response will look like this:

```json
{
  "data": {},
  "errors": [
    {
      message: "Text description of error"
      , name: "Name of the error"
      , status: "HTTP status code"
    }
  ]
}
```

### Methods

The API currently supports the following methods:

> GET /verify - Retrieve meta data about verification flow

**Returns**

- `sharedPrime`: The shared prime number to use for encoding

> PUT /verify - Initiate a verification

**Query parameters**

- `updatedAt` (optional): ISO Datetime specifying the cutoff of returned keys. Default: 2 weeks ago

**Body parameters**

- `keys`: Array of hexadecimal client keys for the server to encode and return

**Returns**

- `since`: ISO Datetime specifying the cutoff of returned positive keys
- `sharedPrime`: The shared prime number to use for encoding
- `positiveKeys`: Server encoded positive keys
- `clientKeys`: Server encoded keys provided by the client in the request body

## Development

To spin up a development server, install docker and docker-compose, then use:

```sh
cd server
docker-compose up --build
```

## Production

To deploy on a production server, again use docker-compose:

```sh
cd server
docker-compose -f docker-compose.prod.yaml --build
```

## TODO

- [ ] move mongodb credentials to docker secrets
