var fs = require("fs");
var read = require("read");
var resumeJson = require("./init-resume-test.json");
var chalk = require("chalk"); // slowly replace colors with chalk

function fillInit() {
    console.log(
    "\nThis utility will generate a resume.json file in your current working directory."
    );
    console.log(
    "Fill out your name and email to get started, or leave the fields blank."
    );
    console.log("All fields are optional.\n");
    console.log("Press ^C at any time to quit.");

    fs.writeFileSync(
    process.cwd() + "/resume-testing.json",
    JSON.stringify(resumeJson, undefined, 2)
    );

    console.log("\e2e resume.json has been created!");
    console.log("");
}

module.exports = fillInit;