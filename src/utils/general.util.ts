// Define a few utility functions

// Alias for JSON.stringify with two spaces indents
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const json = (value: any): string => {
	// Convert the value to json using the toJSON method on it if it is circular
	let jsonificableValue = value
	if (value && value.toJSON) {
		jsonificableValue = value.toJSON()
	}

	// Return the formatted json
	try {
		return JSON.stringify(jsonificableValue, null, 2)
	} catch {
		return '{circularError: true}'
	}
}
