import 'reflect-metadata';

import { autoInjectable } from 'tsyringe';

import { CompileService } from '../../services/compile.service';
import { IBaseController } from './ibase-controller';
const express = require('express');

@autoInjectable()
export class CompileController implements IBaseController {
    public router = express.Router();

    basePath = '';

    constructor(private readonly compileService: CompileService) {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.basePath}/html`, this.compileHTML);
        this.router.get(`${this.basePath}/pdf`, this.compilePDF);
    }

    compileHTML = async (req, res) => {
        this.compileService.compileHTML().subscribe(
            (data) => {
                res.set('Content-Type', 'text/html');
                res.status(200).send(data);
            },
            (error) => {
                res.status(500).send(error);
            }
        );
    };

    compilePDF = async (req, res) => {
        this.compileService.compilePDF().subscribe(
            (data) => {
                res.set('Content-Type', 'application/pdf');
                res.status(200).send(data);
            },
            (error) => {
                res.status(500).send(error);
            }
        );
    };
}
