export class NotFoundError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, NotFoundError);
    }
}

export class ValidationError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ValidationError);
    }
}

export class MethodNotAllowedError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, MethodNotAllowedError);
    }
}

export class CastError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, MethodNotAllowedError);
    }
}