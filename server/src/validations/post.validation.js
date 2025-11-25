const Joi = require("joi");

const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  media: Joi.array()
    .items(
      Joi.object({
        url: Joi.string()
          .custom((value, helpers) => {
            if (value.startsWith("data:image/")) {
              return value;
            }
            try {
              new URL(value);
              return value;
            } catch {
              return helpers.error("string.uri");
            }
          }, "media URL validation")
          .required(),
        alt: Joi.string().max(256).allow(""),
        type: Joi.string().valid("image", "video").required(),
      })
    )
    .default([]),
});

const updatePostSchema = createPostSchema
  .fork(["content", "media"], (s) => s.optional())
  .min(1);

const addCommentSchema = Joi.object({
  text: Joi.string().min(1).max(2000).required(),
});

module.exports = { createPostSchema, updatePostSchema, addCommentSchema };
