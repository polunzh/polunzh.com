class NotFoundError extends Error {
    constructor() {
        super();
        this.status = 404;
        this.message = 'Not Found';
    }
}

module.exports = NotFoundError;
