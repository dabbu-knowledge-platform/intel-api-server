// Type guards to check the type of a variable

// Import the logger
import Logger from './logger.util'
// Import necessary types
import { DabbuError, MissingCredentialsError } from './errors.util'

export function isDabbuError(error: Error): error is DabbuError {
	const isDabbu = (error as DabbuError).isDabbuError !== undefined

	Logger.debug(
		`util.guard.isDabbuError: error is ${
			isDabbu ? 'a dabbu error' : 'not a dabbu error'
		}`,
	)

	return isDabbu
}

// Check if the request headers contain an X-Credentials header. If not, throw
// a 403 Unauthorized error
export function checkClientIDApiKeyPair(
	headers: Record<string, string | number>,
): void {
	const headersContainCredentials =
		headers['X-Credentials'] ||
		(headers['x-credentials'] &&
			typeof (headers['X-Credentials'] || headers['x-credentials']) ===
				'string')

	Logger.debug(
		`util.guard.checkClientIDApiKeyPair: headers ${
			headersContainCredentials
				? 'contain a client ID - API key pair'
				: 'do not contain a client ID - API key pair'
		}`,
	)

	if (!headersContainCredentials) {
		throw new MissingCredentialsError(
			'Missing client ID - API key pair in `X-Credentials` header',
		)
	}
}
