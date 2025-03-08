export class BaseError extends Error{
    public statusCode:number;
    public code:string;
    constructor(message:string,statusCode:number,code:string){
        super(message)
        this.statusCode=statusCode
        this.code=code
        Object.setPrototypeOf(this,new.target.prototype)
    }
}

export class BadRequestError extends BaseError {
    constructor(message = "Bad Request",code="BAD_REQUEST") {
      super(message, 400,code);
    }
  }
  export class UnauthorizedError extends BaseError {
    constructor(message = "Unauthorized",code="UNAUTHERIZED") {
      super(message, 401,code);
    }
  }
  export class NotFoundError extends BaseError {
    constructor(message = "Not Found",code="NOT_FOUND") {
      super(message, 404,code);
    }
  }
  export class InternalServerError extends BaseError {
    constructor(message = "Internal Server Error", code = "INTERNAL_ERROR") {
      super(message, 500, code);
    }
  }

export class ConflictError extends BaseError {
  constructor(message = "there is some Conflict Error",code="CONFLICT_ERROR") {
    super(message, 409, code);
  }
}
export class AutherizationError extends BaseError {
  constructor(message = "Autherization Error",code="Autherization error") {
    super(message, 401, code);
  }
}