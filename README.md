# ETK Prototype

Contact tracing server prototype.

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
