function transformString(inputString) {
  // Remove all symbols except "/"
  let stringWithoutSymbols = inputString.replace(/[^a-zA-Z0-9/]+/g, "");

  // Replace "/" with " and "
  let stringWithSpaces = stringWithoutSymbols.replace(/\//g, " and ");

  // Add spaces between words
  let finalString = stringWithSpaces.replace(/([a-z])([A-Z])/g, "$1 $2");

  return finalString;
}
module.exports = {
  transformString,
};
