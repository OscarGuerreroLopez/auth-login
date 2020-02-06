import * as Joi from "@hapi/joi";

export const LoginSchema = Joi.object().keys({
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  password: Joi.string()
    .min(3)
    .max(20)
    .required(),

  recaptcha: Joi.string()
    .min(3)
    .max(60)
    .required(),

  brandId: Joi.string()
    .min(3)
    .max(60)
    .required(),

  ip: Joi.string()
    .min(3)
    .max(20)
    .required(),

  agent: Joi.string()
    .min(3)
    .max(200)
    .required(),
});

export const VerifyUserSchema = Joi.object().keys({
  key: Joi.string(),
});
