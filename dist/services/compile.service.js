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
exports.CompileService = void 0;
var appRoot = __importStar(require("app-root-path"));
var fs = __importStar(require("fs"));
var log_symbols_1 = __importDefault(require("log-symbols"));
var operators_1 = require("rxjs/operators");
var tsyringe_1 = require("tsyringe");
var inlineCss = require('inline-css');
var HTMLtoDOCX = require('html-to-docx');
var rxjs_1 = require("rxjs");
var internal_compatibility_1 = require("rxjs/internal-compatibility");
var config_service_1 = require("./config.service");
var convertHTMLToPDF = require('pdf-puppeteer');
var CompileService = /** @class */ (function () {
    function CompileService() {
    }
    CompileService.prototype.compileHTML = function () {
        var _this = this;
        return new rxjs_1.Observable(function (subject) {
            try {
                var themeModule = _this.themePkg;
                var jsonData = _this.jsonResume;
                var render = themeModule.render;
                var renderedHTML = render(jsonData);
                renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                subject.next(renderedHTML);
            }
            catch (e) {
                var errorMsg = "couldn't render package " + _this.themePkg;
                console.log(log_symbols_1.default.error, errorMsg);
                subject.error(errorMsg);
            }
        }).pipe(operators_1.concatMap(function (renderedHTML) {
            return internal_compatibility_1.fromPromise(inlineCss(renderedHTML, {
                removeHtmlSelectors: true,
                removeStyleTags: true,
                url: './',
            }));
        }), operators_1.map(function (inlineHTML) {
            return inlineHTML;
        }), operators_1.catchError(function (error) {
            var errorMsg = "couldn't render package " + _this.themePkg + ": " + error;
            console.log(log_symbols_1.default.error, errorMsg);
            return rxjs_1.throwError(error);
        }));
    };
    CompileService.prototype.compileDocx = function () {
        var _this = this;
        return new rxjs_1.Observable(function (subject) {
            try {
                _this.compileHTML().subscribe(function (html) { return __awaiter(_this, void 0, void 0, function () {
                    var fileBuffer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, HTMLtoDOCX(html, null, { table: { row: { cantSplit: true } } })];
                            case 1:
                                fileBuffer = _a.sent();
                                subject.next(fileBuffer);
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (e) {
                var errorMsg = "couldn't render package " + _this.themePkg + ": " + e;
                console.log(log_symbols_1.default.error, errorMsg);
                subject.error(errorMsg);
            }
        });
    };
    CompileService.prototype.compilePDF = function () {
        var _this = this;
        return new rxjs_1.Observable(function (subject) {
            try {
                var convertParameter_1 = {
                    displayHeaderFooter: true,
                    format: 'A4',
                };
                _this.compileHTML().subscribe(function (html) {
                    convertHTMLToPDF(html, function (pdf) {
                        subject.next(pdf);
                    }, convertParameter_1);
                });
            }
            catch (e) {
                var errorMsg = "couldn't render package " + _this.themePkg + ": " + e;
                console.log(log_symbols_1.default.error, errorMsg);
                subject.error(errorMsg);
            }
        });
    };
    Object.defineProperty(CompileService.prototype, "themePkg", {
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
    Object.defineProperty(CompileService.prototype, "jsonResume", {
        get: function () {
            return JSON.parse(fs.readFileSync(appRoot + "/resume.json").toString());
        },
        enumerable: false,
        configurable: true
    });
    CompileService = __decorate([
        tsyringe_1.injectable()
    ], CompileService);
    return CompileService;
}());
exports.CompileService = CompileService;
//# sourceMappingURL=compile.service.js.map