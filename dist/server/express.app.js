"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApp = void 0;
var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var log_symbols_1 = __importDefault(require("log-symbols"));
var tsyringe_1 = require("tsyringe");
var config_service_1 = require("../services/config.service");
var connectLivereload = require('connect-livereload');
var open = require('open');
var ExpressApp = /** @class */ (function () {
    function ExpressApp(port, controllers) {
        this.corsOptions = {
            origin: '*',
        };
        this._app = express();
        this.port = port;
        this._app.use(logger('dev'));
        this._app.use(express.urlencoded({ extended: false }));
        this.routes(controllers);
        this._app.use(function (err, req, res, next) {
            // format error
            console.error(err);
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
        this._app.use(connectLivereload());
        // express options
        this._app.use(cors());
        this._app.options('*', cors(this.corsOptions));
    }
    ExpressApp.prototype.routes = function (controllers) {
        var _this = this;
        controllers.forEach(function (controller) {
            _this._app.use('/', controller.router);
        });
    };
    ExpressApp.prototype.close = function () {
        this._server.close();
    };
    ExpressApp.prototype.listen = function () {
        var that = this;
        this._server = this._app.listen(this.port, function () {
            console.log(log_symbols_1.default.info, "Starting app. Listening on port " + that.port + "!");
            console.log(tsyringe_1.container.resolve(config_service_1.ConfigService).selectedCompileTarges);
            tsyringe_1.container.resolve(config_service_1.ConfigService).selectedCompileTarges.forEach(function (url) {
                open(url);
            });
        });
    };
    Object.defineProperty(ExpressApp.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: false,
        configurable: true
    });
    return ExpressApp;
}());
exports.ExpressApp = ExpressApp;
//# sourceMappingURL=express.app.js.map