import * as appRoot from 'app-root-path';
const FileHound = require('filehound');
import 'reflect-metadata';

import { autoInjectable, container } from 'tsyringe';
const fs = require('fs');
import { ThemePathModel } from '../models/theme-path.model';
import { ExpressApp } from '../server/express.app';
import { CompileController } from '../server/middleware/compile-controller';

@autoInjectable()
export class UtilsService {
    startApp(port: number) {
        return new ExpressApp(port, [container.resolve(CompileController)]);
    }

    getFileNameAndFormat(fileName: string, format: string) {
        const fileFormatFound = this.extractFileFormat(fileName);
        let fileFormatToUse = format;
        if (format && fileFormatFound && format === fileFormatFound) {
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        } else if (fileFormatFound) {
            fileFormatToUse = fileFormatFound;
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        }

        return {
            fileName: fileName,
            fileFormatToUse: fileFormatToUse,
        };
    }

    extractFileFormat(fileName: string) {
        const dotPos = fileName.lastIndexOf('.');
        if (dotPos === -1) {
            return null;
        }
        return fileName.substring(dotPos + 1).toLowerCase();
    }

    initResume() {
        fs.writeFileSync(`${appRoot}/resume.json`, require(`${appRoot}/jsonresume.json`));
    }

    findThemes(additionalPaths?: Array<string>): ThemePathModel[] {
        let paths = [appRoot.path];
        if (additionalPaths) {
            paths = paths.concat(additionalPaths);
        }
        const files = FileHound.create().depth(2).paths(paths).match('package.json').findSync();
        return files
            .filter((path) => require(path).name.includes('kcv-theme'))
            .map((path) => {
                return {
                    name: require(path).name,
                    path: path,
                } as ThemePathModel;
            });
    }

    static getServeUrl(port: number, path: string) {
        return `http://localhost:${port}/${path}`;
    }
}
