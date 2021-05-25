# Dabbu Intel Rest API

## What is a REST API?

An API is an application programming interface - in short, it’s a set of rules that lets programs talk to each other, exposing data and functionality across the internet in a consistent format.

REST stands for Representational State Transfer. This is an architectural pattern that describes how distributed systems can expose a consistent interface. When people use the term ‘REST API,’ they are generally referring to an API accessed via HTTP protocol at a predefined set of URLs.

These URLs represent various resources - any information or content accessed at that location, which can be returned as JSON, HTML, audio files, or images. Often, resources have one or more methods that can be performed on them over HTTP, like GET, POST, PUT and DELETE.

The Dabbu Intel API allows you to extract important topics and people from any of your files. Here is a quick guide to get you started on this in several different environments (if the examples for certain languages are missing, please feel free to add them and submit a pull request).

## Working with the API

There is an instance of the server running on https://dabbu-intel.herokuapp.com/. Though this server is free to use, it is highly recommended to run the server on your own. Instructions to do that are given [here](./running-the-server.md).

### Authenticate with the Server

The Intel API Server uses authentication to protect clients' data. To use the Intel API Server, you must first register a client with it, by making a `POST` request to the `/clients` endpoint. This will return a client ID and API key, which must be specially encoded and supplied with all subsequent requests.

Terminal (using cURL):

```bash
# Make a POST request to the /clients endpoint
curl -X POST "https://dabbu-intel.herokuapp.com/intel-api/v1/clients/"
# This should print out the following in terminal:
# {
#   code: 200,
#   content: {
#     id: '...',
#     apiKey: '...'
#   }
# }
#
# Save the client ID (`id`) and API key (`apiKey`), it is needed to make any requests to the server
```

NodeJS/Typescript:

```typescript
// Use the axios module to make network requests
import axios from 'axios' // OR const axios = require('axios').default

// Make a POST request to the /clients endpoint
axios({
	method: 'POST',
	baseURL: 'https://dabbu-intel.herokuapp.com/intel-api/v1/',
	url: '/clients',
})
	.then((response) => {
		// `response.data` contains the exact server response
		const serverResponse = response.data
		// Dabbu returns all responses in the following format:
		// {
		//   // The http response code
		//   code: 2xx or 4xx or 5xx,
		//   // The error object, present only if an error has occurred
		//   error: {
		//     message: 'user friendly error message',
		//     reason: 'computer friendly reason'
		//   },
		//   // An object or array depending on what you asked for
		//   content: {
		//     // Whatever the response is, present only if there is no error
		//   }
		// }
		// In our case, the content object has an `id` and `apiKey` field.
		const clientId = serverResponse.content.id
		const apiKey = serverResponse.content.apiKey
		// TODO: store the client ID - API key pair safely. Do NOT expose them,
		// otherwise you will need to revoke them and create a new pair
	})
	.catch((error) => {
		// This callback is called if an error occurs
		// `error.response.data` contains the exact server response
		const serverResponse = error.response.data
		// This time the serverResponse will have an error field instead of
		// the content field
		const httpErrorCode = serverResponse.code
		// The error message to show the user
		const errorMessage = serverResponse.error.message
		// The error reason that the program can parse and understand what the
		// problem is. For example, if there is a missing parameter, say in
		// the request body, then the server will return an error code 400.
		// The error reason in this case will be `missingParameter`
		const errorReason = serverResponse.error.reason
	})
```

Once you have the client ID - API key pair, it's time to make some requests!

### Extracting topics and people from a file

Let's jump right into it!

To do this, we need to upload the files from our local hard drive to the server as URL-encoded form data. We will also need to supply the client ID - API key pair to the server in the `X-Credentials` header in the following format: `base64(<clientId>:<apiKey>)`

Terminal (using cURL):

```bash
# Make a GET request to the /data/extract-info endpoint
curl -X GET "https://dabbu-intel.herokuapp.com/intel-api/v1/data/extract-info/" \
	-H "X-Credentials: $(echo "<YOUR_CLIENT_ID>:<YOUR_API_KEY>" | base64)"
	-F "content=@/absolute/path/to/one/file1"
	-F "content=@/absolute/path/to/another/file2"
	-F "content=@/absolute/path/to/one/more/file3"
# This should print out the following in terminal:
# {
#   code: 200,
#   content: [
#     topics: {
#				topic1: [
#					'file1'
#				],
#				topic2: [
#					'file1',
#					'file2'
#				],
#				...
#			}
#     people: {
#				email1: [
#					'file1',
#					'file3'
#				],
#				email2: [
#					'file2'
#				],
#				...
#			}
#   ]
# }
#
```

NodeJS/Typescript:

```typescript
// Use the axios module to make network requests
import axios from 'axios' // OR const axios = require('axios').default
// Use the form-data module to upload the files as form data
import FormData from 'form-data' // OR const FormData = require('form-data')
// Use the fs module to create a readable stream to upload
import * as Fs from 'fs' // OR const Fs = require('fs')

// The client ID and API key we got earlier
const clientId = '...'
const apiKey = '...'

// The file(s) to upload
const file1Data = Fs.createReadStream('/path/to/one/file1')
const file2Data = Fs.createReadStream('/path/to/another/file2')
const file3Data = Fs.createReadStream('/path/to/one/more/file3')

const formData = new FormData()
formData.append('content', [file1Data, file2Data, file3Data])

// Make a GET request to the /data/extract-info endpoint
axios({
	method: 'GET',
	baseURL: 'https://dabbu-intel.herokuapp.com/intel-api/v1/',
	url: '/data/extract-info',
	data: formData,
	headers: {
		...formData.getHeaders(),
		'X-Credentials': Buffer.from(`${clientId}:${apiKey}`).toString(
			'base64',
		),
	},
})
	.then((response) => {
		// `response.data` contains the exact server response
		const serverResponse = response.data
		// Dabbu returns all responses in the following format:
		// {
		//   // The http response code
		//   code: 2xx or 4xx or 5xx,
		//   // The error object, present only if an error has occurred
		//   error: {
		//     message: 'user friendly error message',
		//     reason: 'computer friendly reason'
		//   },
		//   // An object or array depending on what you asked for
		//   content: {
		//     // In our case:
		//     topics: {
		//				topic1: [
		//					'file1'
		//				],
		//				topic2: [
		//					'file1',
		//					'file2'
		//				],
		//				...
		//		 }
		//     people: {
		//				email1: [
		//					'file1',
		//					'file3'
		//				],
		//				email2: [
		//					'file2'
		//				],
		//				...
		//		 }
		//   }
		// }
		const importantTopics = Objects.keys(serverResponse.content.topics)
		const emailAddressesOfPeople = Object.keys(
			serverResponse.content.people,
		)
	})
	.catch((error) => {
		// This callback is called if an error occurs
		// `error.response.data` contains the exact server response
		const serverResponse = error.response.data
		// This time the serverResponse will have an error field instead of
		// the content field
		const httpErrorCode = serverResponse.code
		// The error message to show the user
		const errorMessage = serverResponse.error.message
		// The error reason that the program can parse and understand what the
		// problem is. For example, if the client ID - API key pair you send
		// in the request headers is invalid, then the server will return an
		// error code 401. The error reason in this case will be `invalidCredentials`
		const errorReason = serverResponse.error.reason
	})
```

### User-defined keywords

Sometimes, the algorithm that extracts topics from a file misses out on a few important keywords. This is where the `keywords` field comes in. You can specify a list of keywords or even regular expressions to match in the text. If even one of the keywords are present, or even one regular expression matches, then the program will associate the given topic with that text.

To do this, in addition to uploading the files from our local hard drive to the server as URL-encoded form data. We will also need to supply the client ID - API key pair to the server in the `X-Credentials` header in the following format: `base64(<clientId>:<apiKey>)`

Terminal (using cURL):

```bash
# Make a GET request to the /data/extract-info endpoint
curl -X GET "https://dabbu-intel.herokuapp.com/intel-api/v1/data/extract-info/" \
	-H "X-Credentials: $(echo "<YOUR_CLIENT_ID>:<YOUR_API_KEY>" | base64)"
	-F "content=@/absolute/path/to/one/file1"
	-F "content=@/absolute/path/to/another/file2"
	-F "content=@/absolute/path/to/one/more/file3"
	-F "keywords={\"your topic\": [\"keyword1\", \"regex2\"]}"
# This should print out the following in terminal:
# {
#   code: 200,
#   content: [
#     topics: {
#				topic1: [
#					'file1'
#				],
#				topic2: [
#					'file1',
#					'file2'
#				],
#				your topic: [
#					'file3'
#				],
#				...
#			}
#     people: {
#				email1: [
#					'file1',
#					'file3'
#				],
#				email2: [
#					'file2'
#				],
#				...
#			}
#   ]
# }
#
```

NodeJS/Typescript:

```typescript
// Use the axios module to make network requests
import axios from 'axios' // OR const axios = require('axios').default
// Use the form-data module to upload the files as form data
import FormData from 'form-data' // OR const FormData = require('form-data')
// Use the fs module to create a readable stream to upload
import * as Fs from 'fs' // OR const Fs = require('fs')

// The client ID and API key we got earlier
const clientId = '...'
const apiKey = '...'

// The file(s) to upload
const file1Data = Fs.createReadStream('/path/to/one/file1')
const file2Data = Fs.createReadStream('/path/to/another/file2')
const file3Data = Fs.createReadStream('/path/to/one/more/file3')

const formData = new FormData()
formData.append('content', [file1Data, file2Data, file3Data])
formData.append('keywords', { 'your topic': ['keyword1', 'regex2'] })

// Make a GET request to the /data/extract-info endpoint
axios({
	method: 'GET',
	baseURL: 'https://dabbu-intel.herokuapp.com/intel-api/v1/',
	url: '/data/extract-info',
	data: formData,
	headers: {
		...formData.getHeaders(),
		'X-Credentials': Buffer.from(`${clientId}:${apiKey}`).toString(
			'base64',
		),
	},
})
	.then((response) => {
		// `response.data` contains the exact server response
		const serverResponse = response.data
		// Dabbu returns all responses in the following format:
		// {
		//   // The http response code
		//   code: 2xx or 4xx or 5xx,
		//   // The error object, present only if an error has occurred
		//   error: {
		//     message: 'user friendly error message',
		//     reason: 'computer friendly reason'
		//   },
		//   // An object or array depending on what you asked for
		//   content: {
		//     // In our case:
		//     topics: {
		//				topic1: [
		//					'file1'
		//				],
		//				topic2: [
		//					'file1',
		//					'file2'
		//				],
		//				your topic: [
		//					'file3'
		//			  ],
		//				...
		//		 }
		//     people: {
		//				email1: [
		//					'file1',
		//					'file3'
		//				],
		//				email2: [
		//					'file2'
		//				],
		//				...
		//		 }
		//   }
		// }
		const importantTopics = Objects.keys(serverResponse.content.topics)
		const emailAddressesOfPeople = Object.keys(
			serverResponse.content.people,
		)
	})
	.catch((error) => {
		// This callback is called if an error occurs
		// `error.response.data` contains the exact server response
		const serverResponse = error.response.data
		// This time the serverResponse will have an error field instead of
		// the content field
		const httpErrorCode = serverResponse.code
		// The error message to show the user
		const errorMessage = serverResponse.error.message
		// The error reason that the program can parse and understand what the
		// problem is. For example, if the client ID - API key pair you send
		// in the request headers is invalid, then the server will return an
		// error code 401. The error reason in this case will be `invalidCredentials`
		const errorReason = serverResponse.error.reason
	})
```

That's it for now! The Intel API Server is still under active development. There are a couple of upcoming features, such as the ability to extract and summarise relevant text from the document relating to a specific topic. If you are interested in contributing or just curious, drop a message on [this](https://github.com/dabbu-knowledge-platform/intel-api-server/discussions/categories/general) Github discussion :)
