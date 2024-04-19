class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);          //constructor of Error class( jaha se inherit hua hai)
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;