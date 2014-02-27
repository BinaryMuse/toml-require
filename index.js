var fs = require('fs');
var toml = require('toml');

var installed = false;

function install() {
  if (installed) {
    return;
  }

  require.extensions['.toml'] = function(module, filename) {
    var data, src = fs.readFileSync(filename, {encoding: 'utf8'});
    try {
      data = toml.parse(src);
    } catch (e) {
      if (e.line && e.column) {
        var tomlCompileError = new Error("Error compiling " + filename + " at line " + e.line +
          ", column " + e.column + ": " + e.message);
        throw tomlCompileError;
      } else {
        throw e;
      }
    }
    module.exports = data;
  };

  installed = true;
}

module.exports = {
  install: install
};
