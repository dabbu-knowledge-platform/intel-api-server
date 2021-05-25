// Some types used in the code

// The lda library we use has no types, so tell typescript to ignore it
declare module 'lda'
// Extend express' request type to have an auth field so we can inject our client object in the request
declare namespace Express {
	export interface Request {
		creds: Client
	}
}

// Multer File type. It is not complete, this type exists simply to get rid of
// Typescript type errors
declare interface MulterFile {
	// Name of the form field associated with this file
	fieldname: string
	// Name of the file on the uploader's computer
	originalname: string
	// Value of the `Content-Type` header for this file
	mimetype: string
	// Size of the file in bytes
	size: number
	// `DiskStorage` only: Directory to which this file has been uploaded
	destination: string
	// `DiskStorage` only: Name of this file within `destination`
	filename: string
	// `DiskStorage` only: Full path to the uploaded file
	path: string
}

// A client that can access the Dabbu API
declare interface Client {
	id: string
	apiKey: string
}

// DabbuResponse to any request
declare interface DabbuResponse {
	code: number
	error?: { message: string; reason: string }
	content?: {
		topics: Record<string, Array<string>>
		people: Record<string, Array<string>>
	}
}
