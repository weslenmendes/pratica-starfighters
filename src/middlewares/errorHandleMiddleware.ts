import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface ErrorRequest extends ErrorRequestHandler {
  type: string;
  message: string;
}

export async function errorHandler(
  err: ErrorRequest,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.type === "notAuthorized") {
    return res.status(401).send({ message: err.message });
  }

  if (err.type === "notFound") {
    return res.status(404).send({
      message: err.message,
    });
  }

  if (err.type === "invalidFormat") {
    return res.status(422).send({
      message: err.message,
    });
  }

  res.status(500).send({
    message: "Something went wrong",
  });
}
