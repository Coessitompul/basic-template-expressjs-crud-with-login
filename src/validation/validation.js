import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  // ini untuk memvalidasi datanya apakah sudah sesuai dengan yang kita tentukan, schema ini berisi address-validation.js, user-validation.js, address-validation.js, dan lain-lain
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false // digunakan untuk mereject field yang tidak diketahui
  })
  if (result.error){
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
}

export {
  validate
}