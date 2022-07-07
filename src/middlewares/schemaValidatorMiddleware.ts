import { Request, Response, NextFunction } from "express";

export function validateSchema(schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw {
        type: "invalidFormat",
        message: error.details.map((e) => e.message).join(", "),
      };
    }

    next();
  };
}
