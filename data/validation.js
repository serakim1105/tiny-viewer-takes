const exportedMethods = {
  validateId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `${varName} cannot be an empty string or just spaces`;
    // if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  validateString(strVal, varName) {
    // res.status(400).render('error', { errorMessage: `You need to supply a ${varName}`});

    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  validateStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    /*if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }
*/
    return arr;
  },

  validateNumber(input, varName) {
    if (typeof input !== "number" || input <= 0 || !Number.isFinite(input)) {
      throw `Error: ${varName} must be a number greater than 0 and less than infinity`;
    }
  },

  validateDateString(dateStr) {
    const pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    if (typeof dateStr !== "string" || !pattern.test(dateStr)) {
      throw "Date released must be a valid date in mm/dd/yyyy format";
    }

    const date = new Date(dateStr);
    const [, month, day, year] = dateStr.match(pattern);
    const isValidDate =
      date.getFullYear() === Number(year) &&
      // The month in date is 0 based
      date.getMonth() + 1 === Number(month) &&
      date.getDate() === Number(day);

    if (!isValidDate) {
      throw `Date ${dateStr} is not a valid date`;
    }
  },

  validateBoolean(value, varName) {
    if (typeof value !== "boolean") {
      throw `${varName} must be a boolean`;
    }
  },

  validateUrl(input) {
    const pattern = /^http:\/\/(www\.)?.+\.com(\/.+)?$/;
    if (typeof input !== "string" || !pattern.test(input)) {
      throw "Error: website must start with http://www. and contains .com";
    }
  },

  checkEmail(email) {
    if (!email) throw "Error: You must provide an email address.";
    email = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw "Email must be of format xyz@xyz.xyz";
    }
    return email;
  },

  checkPassword(password) {
    if (!password) throw "Error: You must provide a password.";
    if (typeof password !== "string" || password.includes(" ")) {
      throw "Password must be a string without spaces.";
    }
    if (password.length < 8) {
      throw "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      throw "Password must contain at least one uppercase letter.";
    }
    if (!/\d/.test(password)) {
      throw "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw "Password must contain at least one special character.";
    }
    return password;
  },
};

export default exportedMethods;
