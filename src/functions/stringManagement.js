/**
 * Replace all elements in string
 * @param {String} string 
 * @returns {String}
 */
function replaceAll(string, search, replacement) {

    while (string.includes(search)) {
        string = string.replace(search, replacement);
    }
    return string;
}

module.exports = {
    replaceAll
}