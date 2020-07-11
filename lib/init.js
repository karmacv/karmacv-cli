var fs = require("fs");
var read = require("read");
var resumeJson = require("./init-resume.json");
var chalk = require("chalk"); // slowly replace colors with chalk

function fillInit() {
  fs.writeFileSync(
    process.cwd() + "/resume.json",
    JSON.stringify(resumeJson, undefined, 2)
  );

  console.log("\nYour resume.json has been created!".green);
  console.log("");
  console.log(
    "To generate a formatted .html .md .txt or .pdf resume from your resume.json"
  );
  console.log(
    "type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`"
  );
  console.log(
    "\nYou can optionally specify an available theme for html and pdf resumes using the --theme flag."
  );
  console.log("Example: `resume export myresume.pdf --theme flat`");
  console.log(
    "Or simply type: `resume export` and follow the prompts."
  );
  console.log("");

  process.exit();
}

function init() {
  fillInit();
}

module.exports = init;

//todo: fix success wording
