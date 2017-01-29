var fs = require("fs");
var path = require("path");
var spawnSync = require("child_process").spawnSync;

module.exports = async function(appName, questions, location) {

    var nodeInstalled = fs.existsSync(path.join(process.cwd(), "node_modules"));

    if (!nodeInstalled) {
        spawnSync("npm", ["install"]);
    }
    if(!fs.existsSync(path.join(process.cwd(), "node_modules"))){
      throw new Error("npm install failed please make sure you are running at root of project")
    }

    var nEw = require("pid-async-class").nEw;
    var Installer = require("./lib/installer");
    var installer = await nEw(Installer, appName, questions || [], location || "local",process.cwd());

    await installer.install();
    installer.__destroy();
}
