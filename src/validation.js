import { required, confirmed, length, email } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

var validateCheckboxChecked = function (value) {
  return value === "true" ? true : value === "false" ? false : value;
};

var checkboxChecked = {
  validate: validateCheckboxChecked,
};

extend("checkboxChecked", {
  ...checkboxChecked,
  message: "This checkbox must be checked",
});

extend("required", {
  ...required,
  message: "This field is required",
});

extend("email", {
  ...email,
  message: "This field must be a valid email",
});

extend("confirmed", {
  ...confirmed,
  message: "This field confirmation does not match",
});

extend("length", {
  ...length,
  message: "The {_field_} must be {length} characters",
});
