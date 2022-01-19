# shopping-list-api

[![Coverage Status](https://coveralls.io/repos/github/bmviniciuss/shopping-list-api/badge.svg?branch=main)](https://coveralls.io/github/bmviniciuss/shopping-list-api?branch=main)

## Development

### How to run integrated tests
To run the api's integrations tests you need to have installed NPM, Docker and Docker Compose on your machine. After that follow the instructions bellow:

1. Run the follow commando to start the testing container:
```bash
npm run test:docker:up
```

2. To run **only** the integration tests run the follwing command:
```bash
npm run test:integration
```

3. To run all tests with coverage report:
```bash
npm run test:local:ci
```

4. Remove the test container after you've finished:
```bash
npm run test:docker:down
```