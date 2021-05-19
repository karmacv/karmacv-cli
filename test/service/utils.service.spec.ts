import 'reflect-metadata';

import * as appRoot from 'app-root-path';
import { container } from 'tsyringe';

import { UtilsService } from '../../services/utils.service';

describe('Utils service spec', () => {
    it('should start server', (done) => {
        const utilsService = container.resolve(UtilsService);
        const themes = utilsService.findThemes([`${appRoot.path}/themes`]);
        expect(themes.length).toBe(1);
        done();
    });
});
