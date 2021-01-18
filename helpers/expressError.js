class ExpressError extends Error {
    constructor(statusCode = 500, message = "An unexpected error has occurred.") {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;