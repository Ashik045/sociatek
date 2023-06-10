import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

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

export const PostValidatioin = [
  check("text")
    .isLength({ min: 1 })
    .withMessage("This input field is required!"),
];

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
