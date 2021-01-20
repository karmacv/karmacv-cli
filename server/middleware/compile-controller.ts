import { injectable } from 'tsyringe';

import { CompilerService } from '../../services/compiler.service';
import { IBaseController } from './ibase-controller';
const express = require('express');

@injectable()
export class CompileController implements IBaseController {
    public router = express.Router();

    basePath = '/';

    constructor(private readonly compileService: CompilerService) {}

    initRoutes() {
        this.router.post(`${this.basePath}`, this.compileHTML);
    }

    compileHTML = async (req, res) => {
        this.compileService.renderHtml().subscribe(
            (data) => {
                res.set('Content-Type', 'text/html');
                res.status(200).send(data);
            },
            (error) => {
                res.status(500).send(error);
            }
        );
    };
}
