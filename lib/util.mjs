/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
/**
* Verifies if a value represents an integer
* @param {string} x
* @return {boolean}
*/
function isNonEmptyString(x) {
  return typeof(x) === "string" && x.trim() !== "";
}
/**
* Return the next year value (e.g. if now is 2013 the function will return 2014)
* @return {number}  the integer representing the next year value
*/
function nextYear() {
  var date = new Date();
  return (date.getFullYear() + 1);
}
/**
* Verifies if a value represents an integer or integer string
* @param {string} x
* @return {boolean}
*/
function isIntegerOrIntegerString(x) {
  return typeof(x) === "number" && Number.isInteger(x) ||
      typeof(x) === "string" && x.search(/^-?[0-9]+$/) === 0;
}
/**
* Creates a typed "data clone" of an object
* @param {object} obj
*/
function cloneObject(obj) {
  var clone = Object.create( Object.getPrototypeOf(obj));
  for (var p in obj) {
    if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
      clone[p] = obj[p];
    }
  }
  return clone;
}
/**
 * Create option elements from a map of objects
 * and insert them into a selection list element
 *
 * @param {object} objMap  A map of objects
 * @param {object} selEl  A select(ion list) element
 * @param {string} stdIdProp  The standard identifier property
 * @param {string} displayProp [optional]  A property supplying the text
 *                 to be displayed for each object
 */
function fillSelectWithOptions(objMap, selEl, stdIdProp, displayProp) {
  var optionEl=null, obj=null,
      keys = Object.keys( objMap);
  for (let i of keys.keys()) {
    obj = objMap[keys[i]];
    optionEl = document.createElement("option");
    optionEl.value = obj[stdIdProp];
    optionEl.text = displayProp ? obj[displayProp] : obj[stdIdProp];
    selEl.add( optionEl, null);
  }
}

export { isNonEmptyString, nextYear, isIntegerOrIntegerString,
  cloneObject, fillSelectWithOptions };
