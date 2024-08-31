/**
 * Defines a custom error(400) object that we can later handle
 * in our src/errorHandler.ts
 */
export class BadRequestError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = 400;
  }
}

/**
 * Defines a token error(401) object that we can later handle
 */
export class TokenError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = 401;
  }
}

/**
 * Defines a forbidden error(403) object that we can later handle
 */
export class ForbiddenError extends Error {
  public code: number;
  constructor(message: string) {
    super(message);
    this.code = 403;
  }
}
