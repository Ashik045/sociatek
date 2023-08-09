import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    username?: string;
  };
}

/**
 * The function `PostAuthValidator` is a middleware function that checks if the request has a valid JWT
 */
export const PostAuthValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // Remove the "Bearer " prefix

    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY || "") as { id: string };

      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized!" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized!" });
  }
};

/* Defining an array of validation checks for the "text" field in a post
request. */
export const PostValidatioin = [
  check("text")
    .isLength({ min: 1 })
    .withMessage("This input field is required!"),
];

/**
 * The function is a middleware that checks if there are any validation errors in the request and sends a response with the errors if there are any, otherwise it calls the next middleware.
 */
export const PostValidatioinHandler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  const mappedErrs = errors.mapped();

  if (Object.keys(mappedErrs).length === 0) {
    next();
  } else {
    res.status(500).json({
      error: mappedErrs,
    });
  }

  // format of mapped errors
  // mappedErrs = {
  // name: {
  // msg: "Name is required"
  // },
  // email: {
  // msg: "Invalid email address"
  // }
  // }
};

/**
 * The LikePostMiddleware function checks if the request has a valid JWT token in the authorization
 * header and sets the user ID on the request object if the token is valid.
 */
export const LikePostMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // Remove the "Bearer " prefix

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || ""
      ) as { id: string };

      req.user = { id: decodedToken.id }; // Set the user ID on the request object
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

/**
 * The DeletePostMiddleware function checks if the request has a valid JWT token in the authorization
 * header and sets the username in the request object if the token is valid, otherwise it returns an unauthorized error response.
 */
export const DeletePostMilldeware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    const token = authorizationHeader.slice(7); // Remove the "Bearer " prefix

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || ""
      ) as { username: string };

      req.user = { username: decodedToken.username };
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
