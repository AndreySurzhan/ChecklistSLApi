module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(...args) {
        super(...args);

        this.statusCode = 404;
    }
}
