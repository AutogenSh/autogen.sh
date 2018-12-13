
var convert = (function () {
    return {
        int: function (str, defval) {
            var val = parseInt(str);
            if (isNaN(val)) {
                return defval;
            }
            return val;
        }
    }
})();

module.exports = convert;
