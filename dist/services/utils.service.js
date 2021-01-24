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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
var appRoot = __importStar(require("app-root-path"));
var FileHound = require('filehound');
require("reflect-metadata");
var tsyringe_1 = require("tsyringe");
var fs = require('fs');
var express_app_1 = require("../server/express.app");
var compile_controller_1 = require("../server/middleware/compile-controller");
var UtilsService = /** @class */ (function () {
    function UtilsService() {
    }
    UtilsService.prototype.startApp = function (port) {
        return new express_app_1.ExpressApp(port, [tsyringe_1.container.resolve(compile_controller_1.CompileController)]);
    };
    UtilsService.prototype.getFileNameAndFormat = function (fileName, format) {
        var fileFormatFound = this.extractFileFormat(fileName);
        var fileFormatToUse = format;
        if (format && fileFormatFound && format === fileFormatFound) {
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        }
        else if (fileFormatFound) {
            fileFormatToUse = fileFormatFound;
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        }
        return {
            fileName: fileName,
            fileFormatToUse: fileFormatToUse,
        };
    };
    UtilsService.prototype.extractFileFormat = function (fileName) {
        var dotPos = fileName.lastIndexOf('.');
        if (dotPos === -1) {
            return null;
        }
        return fileName.substring(dotPos + 1).toLowerCase();
    };
    UtilsService.prototype.initResume = function () {
        fs.writeFileSync(appRoot + "/resume.json", require(appRoot + "/jsonresume.json"));
        console.log('Your resume.json has been created!');
        console.log('');
        console.log('To generate a formatted .html .md .txt or .pdf resume from your resume.json');
        console.log('type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`');
        console.log('You can optionally specify an available theme for html and pdf resumes using the --theme flag.');
        console.log('Example: `resume export myresume.pdf --theme flat`');
        console.log('Or simply type: `resume export` and follow the prompts.');
        console.log('');
        process.exit();
    };
    UtilsService.prototype.findThemes = function (additionalPaths) {
        var paths = [appRoot.path];
        if (additionalPaths) {
            paths = paths.concat(additionalPaths);
        }
        var files = FileHound.create().depth(2).paths(paths).match('package.json').findSync();
        return files
            .filter(function (path) { return require(path).name.includes('kcv-theme'); })
            .map(function (path) {
            return {
                name: require(path).name,
                path: path,
            };
        });
    };
    UtilsService = __decorate([
        tsyringe_1.autoInjectable()
    ], UtilsService);
    return UtilsService;
}());
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils.service.js.map