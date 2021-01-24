"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerService = void 0;
require("reflect-metadata");
var appRoot = __importStar(require("app-root-path"));
var btoa_1 = __importDefault(require("btoa"));
var rxjs_1 = require("rxjs");
var tsyringe_1 = require("tsyringe");
var config_service_1 = require("./config.service");
var themeServer = process.env.THEME_SERVER || 'https://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'https://registry.jsonresume.org';
var request = require('superagent');
var http = require('http');
var fs = require('fs');
var path = require('path');
var read = require('read');
var spinner = require('char-spinner');
var chalk = require('chalk');
var puppeteer = require('puppeteer');
var SUPPORTED_FILE_FORMATS = ['html', 'pdf'];
var CompilerService = /** @class */ (function () {
    function CompilerService() {
    }
    CompilerService.prototype.renderHtml = function () {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            try {
                var resumeJson = _this.jsonResume;
                var themePkg = _this.themePkg;
                var contents = themePkg.render(resumeJson);
                return subscriber.next(contents);
            }
            catch (e) {
                return subscriber.error(e);
            }
        });
    };
    CompilerService.prototype.createPdf = function (resumeJson, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var html, themePkg, puppeteerLaunchArgs, browser, page, pdf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.renderHtml().toPromise()];
                    case 1:
                        html = _a.sent();
                        themePkg = this.themePkg;
                        puppeteerLaunchArgs = [];
                        if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
                            puppeteerLaunchArgs.push('--no-sandbox');
                        }
                        return [4 /*yield*/, puppeteer.launch({
                                args: puppeteerLaunchArgs,
                            })];
                    case 2:
                        browser = _a.sent();
                        return [4 /*yield*/, browser.newPage()];
                    case 3:
                        page = _a.sent();
                        return [4 /*yield*/, page.emulateMedia((themePkg.pdfRenderOptions && themePkg.pdfRenderOptions.mediaType) || 'screen')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.goto("data:text/html;base64," + btoa_1.default(unescape(encodeURIComponent(html))), { waitUntil: 'networkidle0' })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.pdf(__assign({ path: fileName + ".pdf", format: 'Letter', printBackground: true }, themePkg.pdfRenderOptions))];
                    case 6:
                        pdf = _a.sent();
                        return [4 /*yield*/, browser.close()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, pdf];
                }
            });
        });
    };
    Object.defineProperty(CompilerService.prototype, "themePkg", {
        get: function () {
            try {
                var themePath = tsyringe_1.container.resolve(config_service_1.ConfigService).themePath;
                return require(themePath + "/index.js");
            }
            catch (err) {
                // Theme not installed
                console.log('No theme found in the current folder.');
                process.exit();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompilerService.prototype, "jsonResume", {
        get: function () {
            return JSON.parse(fs.readFileSync(appRoot + "/resume.json").toString());
        },
        enumerable: false,
        configurable: true
    });
    CompilerService = __decorate([
        tsyringe_1.autoInjectable()
    ], CompilerService);
    return CompilerService;
}());
exports.CompilerService = CompilerService;
//# sourceMappingURL=compiler.service.js.map