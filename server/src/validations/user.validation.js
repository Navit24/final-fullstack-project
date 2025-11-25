// src/validations/user.validation.js

const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.object().keys({
    first: Joi.string().min(2).max(256).required(),
    last: Joi.string().min(2).max(256).required(),
  }),

  phone: Joi.string()
    .ruleset.regex(/^0\d{1,2}-?\s?\d{3}\s?\d{4}$/)
    .rule({ message: "Phone must be a valid Israeli phone number" })
    .required(),

  birthDate: Joi.date().required().max("now").min("1900-01-01"),

  email: Joi.string()
    .ruleset.regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .rule({ message: "Email must be a valid email address" })
    .required(),

  password: Joi.string()
    .min(8)
    .ruleset.regex(/^(?=.*[A-Za-z])[A-Za-z0-9]{8,}$/)
    .rule({
      message:
        "password must be 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character",
    })
    .required(),

  avatar: Joi.object().keys({
    url: Joi.string()
      .custom((value, helpers) => {
        if (!value) return value;
        if (value.startsWith("data:image/")) return value;
        try {
          new URL(value);
          return value;
        } catch {
          return helpers.error("string.uri");
        }
      })
      .allow(""),
    alt: Joi.string().max(256).allow(""),
  }),

  address: Joi.object().keys({
    country: Joi.string().min(2).max(256).allow(""),
    city: Joi.string().min(2).max(256).allow(""),
    street: Joi.string().min(2).max(256).allow(""),
    houseNumber: Joi.number().greater(0).allow(0),
  }),
});

const updateSchema = registerSchema
  .fork(
    ["name", "phone", "birthDate", "email", "password", "avatar", "address"],
    (schema) => schema.optional()
  )
  .min(1);

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema, updateSchema };
