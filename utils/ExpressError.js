class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);   // pass message to built-in Error
        this.statusCode = statusCode; 
    }
}

module.exports = ExpressError;
