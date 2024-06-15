class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
   
   
  }
}


class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;

  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;

  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    
  }
}


class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;

  }
}




module.exports = {
  BadRequestError, 
  NotFoundError, 
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
};