# ETK Prototype

Contact tracing server prototype.

## Notes

Currently the server secret random number is generated at start time of the
thread. If multiple threads are used they will have different random numbers
for encoding the keys. This shouldn't be a problem with the current protocol
but if future iterations of this protocol call for multiple roundtrips between
server and client, then this could cause consistency problems.

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
- `encounterIds`: Server encoded keys provided by the client in the request body

## Development

To spin up a development server, install docker and docker-compose, then use:

```sh
cd server
docker-compose build
```

If you run into trouble in windows, you may need to run:

```sh
docker run -i -t --mount type=bind,source=<path to ETK code roo>\server\api,destination=/app server_api /bin/bash
```

Inside the `api/` directory you will then run:

```sh
yarn cache clean
yarn install
```

Repeat the same steps for the admin-panel:
```sh
docker run -i -t --mount type=bind,source=<path to ETK code roo>\server\admin-panel,destination=/app node /bin/bash
```

Inside the `api/` directory you will then run:

```sh
yarn cache clean
yarn install
```

After a successful install you should be able to run:

```sh
docker-compose up
```

## Production

To deploy on a production server, again use docker-compose:

```sh
cd server
docker-compose -f docker-compose.prod.yaml up --build
```

## TODO

- [ ] move mongodb credentials to docker secrets
