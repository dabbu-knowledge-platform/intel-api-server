## Features

- Added Basic HTTP Authentication
  - all clients need to 'register' themselves with the server by making a `POST` request to the `/clients` endpoint
    - this returns a client ID - API key pair that must be sent in all subsequent requests in the `X-Credentials` header encoded as follows: `base64(<client id>:<api key>)`
    - provider-specific credentials like access tokens can be sent in the `X-Provider-Credentials` header
  - API keys can be replaced by making a `POST` request with the current API key to the `/clients/:clientId` endpoint
    - this returns the current client ID and a new API key
  - The client can be deleted by making a `DELETE` request to `/clients/:clientId` endpoint
- Add an option (`extract-info` endpoint) for the user to specify keywords or regex, that when found in the text, should associate the given topic with that file in addition to already identified topics

## Changes

- Typescript rewrite
- Remove non-function one-pager endpoint
- Add helmet middleware for basic security
- Add a logger
  - Logs are stored locally ONLY, in the config directory
    - Windows: `%APPDATA%\Dabbu Files API Server\logs\files-api-server.log`
    - MacOS: `/Users/<username>/Library/Dabbu Files API Server/logs/files-api-server.log`
    - Linux: `($HOME OR $XDG_CONFIG_HOME)/.config/Dabbu Files API Server/logs/files-api-server.log`
  - Logger still doesn't currently log anything, but it will in future versions. These logs may contain sensitive information, please be careful to remove sensitive information while posting them publicly. We will work towards masking this sensitive information.

## Docs

- Add API docs
- Add guide for running server on your own
- Add getting started guide for using the APIs in your own client

## Builds/CI

- Automatic releases only from the develop branch
- Add bash scripts for all jobs

## Tests

- Use jest for tests
  - Add dummy tests
  - Tests are not yet implemented, PRs welcome.

## Style/Format

- Add ts files to .editorconfig
- Use ESLint to lint typescript files
