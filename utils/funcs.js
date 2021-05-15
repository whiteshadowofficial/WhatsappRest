function validatePhone(str) {
    var res = str.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/);
    return (res == null) ? 0 : 1;
}

function formatPhone(str) {
    var res = str.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/);
    if(res == null) return "";
    return res.slice(1, 5).join("")
}

function regexIpAddress(str) {
    var match = str.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/gm);
    return (match != null && match.length) > 0 ? match[0] : "";
}

module.exports = {
    validatePhone,
    formatPhone,
    regexIpAddress
}