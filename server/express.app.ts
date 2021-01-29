import { Application } from 'express';
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
import logSymbols from 'log-symbols';
import { container } from 'tsyringe';
const reload = require('reload');
import * as appRoot from 'app-root-path';
import * as http from 'http';
import * as watch from 'watch';

import { ConfigService } from '../services/config.service';
const open = require('open');

export class ExpressApp {
    private _app: Application;
    private _server: http.Server;
    private _io;
    public port: number;

    corsOptions = {
        origin: '*',
    };

    constructor(port: number, controllers: any) {
        this._app = express();
        this.port = port;
        this._app.use(logger('dev'));
        this._app.use(express.urlencoded({ extended: false }));
        this.routes(controllers);
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

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
        controllers.forEach((controller) => {
            this._app.use('/', controller.router);
        });
    }

    close() {
        this._server.close();
    }

    listen() {
        const that = this;
        this._server = http.createServer(this._app);
        this._io = require('socket.io')(this._server);
        that._server.listen(that.port, function () {
            console.log(logSymbols.info, `Starting app. Listening on port ${that.port}!`);
            if (container.resolve(ConfigService).selectedCompileTarges) {
                container.resolve(ConfigService).selectedCompileTarges.forEach((url) => {
                    open(url);
                });
            }
        });
        that._io.on('connection', (socket) => {
            watch.watchTree(`${appRoot}/test/themes/kcv-theme-retro`, function (f, curr, prev) {
                socket.broadcast.emit('refreshPage');
            });
        });
    }

    get app(): Application {
        return this._app;
    }
}
