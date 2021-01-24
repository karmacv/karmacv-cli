"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var appRoot = __importStar(require("app-root-path"));
var reload = require('reload');
var tsyringe_1 = require("tsyringe");
var Select = require('enquirer').Select;
var log_symbols_1 = __importDefault(require("log-symbols"));
var utils_service_1 = require("./services/utils.service");
require('dotenv').load({ silent: true });
var pkg = require(appRoot + '/package.json');
var program = require('commander');
var MultiSelect = require('enquirer').MultiSelect;
var port = 5000;
var livereload = require('livereload');
var liveReloadServer = livereload.createServer();
program.usage('[command] [options]').version(pkg.version).option('-p, --port <port>', 'Used by `serve`', 5000);
program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function () {
    tsyringe_1.container.resolve(utils_service_1.UtilsService).initResume();
});
program
    .command('serve')
    .description("Serve resume at http://localhost:" + port)
    .action(function () {
    var themes = tsyringe_1.container.resolve(utils_service_1.UtilsService).findThemes([appRoot + "/test/themes/kcv-theme-retro"]);
    if (themes.length) {
        var prompt_1 = new Select({
            name: 'path',
            message: 'Choose a theme',
            choices: themes.map(function (item) {
                var path = item.path.replace('/package.json', '');
                return {
                    name: path,
                    message: item.name,
                    value: path,
                };
            }),
        });
        prompt_1
            .run()
            .then(function (path) {
            tsyringe_1.container.register('themePath', { useValue: "" + path });
            var prompt = new MultiSelect({
                name: 'value',
                message: 'Choose your compilation target',
                choices: [
                    { message: "http://localhost:" + port + "/HTML", name: "http://localhost:" + port + "/HTML", value: "http://localhost:" + port + "/HTML" },
                    { message: "http://localhost:" + port + "/PDF", name: "http://localhost:" + port + "/PDF", value: "http://localhost:" + port + "/PDF" },
                ],
            });
            prompt
                .run()
                .then(function (compilationTargets) {
                tsyringe_1.container.register('selectedCompileTarges', { useValue: compilationTargets });
                tsyringe_1.container.resolve(utils_service_1.UtilsService).startApp(port).listen();
            })
                .catch(console.error);
        })
            .catch(console.error);
    }
    else {
        console.log(log_symbols_1.default.info, "No themes found.");
    }
});
program.parse(process.argv);
var validCommands = program.commands.map(function (cmd) {
    return cmd._name;
});
if (!program.args.length) {
    program.help();
}
else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log('Invalid argument:', process.argv[2]);
    program.help();
}
//# sourceMappingURL=index.js.map