import { Application } from 'express';
import * as http from 'http';
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
import logSymbols from 'log-symbols';

export class ExpressApp {
    private _app: Application;
    private _server: http.Server;
    public port: number;

    corsOptions = {
        origin: '*',
    };

    constructor(appInit: { port: number; middleWares: any; controllers: any }) {
        const that = this;
        this._app = express();
        this.port = appInit.port;
        this._app.use(logger('dev'));
        this._app.use(express.urlencoded({ extended: false }));
        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this._app.use((err, req, res, next) => {
            // format error
            console.error(err);
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
        // express options
        this._app.use(cors());
        this._app.options('*', cors(this.corsOptions));
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach((middleWare) => {
            this._app.use(middleWare);
        });
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
        controllers.forEach((controller) => {
            this._app.use('/', controller.router);
        });
    }

    close() {
        this._server.close();
    }

    listen(port: number) {
        this.port = port ?? 5000;
        const that = this;
        this._server = this._app.listen(this.port, function () {
            console.log(logSymbols.info, `Starting app. Listening on port ${that.port}!`);
        });
    }

    get app(): Application {
        return this._app;
    }
}
