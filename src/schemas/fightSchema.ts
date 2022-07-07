import Joi from "joi";

export const battleSchema = Joi.object({
  firstUser: Joi.string().required().messages({
    "string.empty": "the firstUser is required",
    "string.required": "the firstUser is required",
  }),
  secondUser: Joi.string().required().messages({
    "string.empty": "the secondUser is required",
    "string.required": "the secondUser is required",
  }),
});
