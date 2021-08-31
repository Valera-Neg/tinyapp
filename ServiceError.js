class ServiceError extends Error {
  constructor(message, statusCode, source) {
    super(message);
    this.statusCode = statusCode;
    this.source = source;
  }
}

module.exports = { ServiceError }