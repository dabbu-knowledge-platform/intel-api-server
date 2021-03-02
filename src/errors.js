/* Dabbu Intel API Server - errors.js
 * Copyright (C) 2021  gamemaker1
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// MARK: Errors

// The superclass for custom errors that Dabbu Intel API Server can throw
exports.GeneralError = class GeneralError extends Error {
  // It must have an HTTP response code, a user-friendly message and a computer-friendly reason
  constructor(code, message, reason) {
    super()
    this.code = code
    this.message = message
    this.reason = reason
  }
}

// Bad request; returned if the URL has any typos or mistakes
exports.BadRequestError = class BadRequestError extends (
  this.GeneralError
) {
  constructor(message) {
    super(400, message, 'malformedURL')
  }
}
// Missing provider specific variable in the request body; but returns a 400 Malformed URL code
exports.MissingParamError = class MissingParamError extends (
  this.GeneralError
) {
  constructor(message) {
    super(400, message, 'missingParam')
  }
}
// Missing access token in the request header
exports.UnauthorizedError = class UnauthorizedError extends (
  this.GeneralError
) {
  constructor(message) {
    super(403, message, 'unauthorized')
  }
}
// 404 not found
exports.NotFoundError = class NotFoundError extends this.GeneralError {
  constructor(message) {
    super(404, message, 'notFound')
  }
}

// MARK: Error handler

// The custom error handler we use on the server
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof this.GeneralError) {
    // If it is a custom error, return the code, message and reason accordingly
    return res.status(err.code).json({
      code: err.code,
      error: {
        message: err.message,
        reason: err.reason,
      },
    })
  } else {
    if (err.code && typeof err.code === 'number') {
      // If there is a valid numerical code to the error, return it with the code, message and "unknownReason"
      console.error(err)
      return res.status(err.code).json({
        code: err.code,
        error: {
          message: err.message,
          reason: 'unknownReason',
        },
      })
    } else if (err.isAxiosError) {
      console.error(err.response.data)
      // If it's an axios error, return the status code and the error
      const errorMessage =
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message
          ? err.response.data.error.message
          : 'Unknown error'
      const errorReason =
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.reason
          ? err.response.data.error.reason
          : err.response.data.error.code || 'unknownReason'
      console.error(
        `${err.response.status} (${err.response.statusText}): ${errorMessage}`
      )
      return res.status(err.response.status).json({
        code: err.response.status,
        error: {
          message: errorMessage,
          reason: errorReason,
        },
      })
    } else {
      console.error(err)
      // Else return an internalServerError
      return res.status(500).json({
        code: 500,
        error: {
          message: err.message,
          reason: 'internalServerError',
        },
      })
    }
  }
}
