Convert = function() {
    this.int = function(str, defval) {
        var val = parseInt(str)
        if (isNaN(val)) {
            return defval
        }
        return val
    }
}

var convert = new Convert()
module.exports = convert
