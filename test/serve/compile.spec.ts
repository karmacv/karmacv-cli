import 'reflect-metadata';

import * as appRoot from 'app-root-path';
import { container } from 'tsyringe';

import { ExpressApp } from '../../server/express.app';
import { CompileController } from '../../server/middleware/compile-controller';
import { UtilsService } from '../../services/utils.service';
const request = require('supertest');

describe('Rendered HTML document', () => {
    let expressApp: ExpressApp;

    beforeAll(async (done) => {
        container.register('selectedCompileTarges', { useValue: '' });
        container.register('themePath', { useValue: `${appRoot}/test/themes/kcv-theme-retro` });
        const utilsService = container.resolve(UtilsService);
        expressApp = new ExpressApp(5000, [container.resolve(CompileController)]);
        expressApp.listen();
        done();
    });

    afterAll(async (done) => {
        expressApp.close();
    });

    it('should start server', function (done) {
        const jsonResume = require(`${appRoot}/resume.json`);
        request(expressApp.app)
            .get(`/html`)
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .expect((res) => {
                expect(res.text).toContain(jsonResume.basics.label);
            })
            .end(function (err, res) {
                if (err) throw err;
                done();
            });
    });
});
