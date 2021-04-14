import * as appRoot from 'app-root-path';
const FileHound = require('filehound');
import 'reflect-metadata';
const fse = require('fs-extra');
const editJsonFile = require('edit-json-file');

import { autoInjectable, container } from 'tsyringe';
const fs = require('fs');
import { ThemePathModel } from '../models/theme-path.model';
import { ExpressApp } from '../server/express.app';
import { CompileController } from '../server/middleware/compile-controller';
import { PromptService } from './prompt.service';

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

    createTheme() {
        container
            .resolve(PromptService)
            .createTemplate()
            .run()
            .then((answer) => {
                this.initMainTemplate(JSON.parse(answer.result));
            })
            .catch(console.error);
    }

    initMainTemplate(packageConfig: any) {
        const targetPath = `${process.cwd()}/${packageConfig.name}`;
        const sourceTheme = `${appRoot}/themes/kcv-theme-main`;
        fse.copySync(sourceTheme, `${targetPath}`, { overwrite: true });

        const targetPackagePath = `${targetPath}/package.json`;
        const editPackage = editJsonFile(targetPackagePath);
        editPackage.set('name', packageConfig.name);
        editPackage.set('description', packageConfig.description);
        editPackage.set('version', packageConfig.version);
        editPackage.set('homepage', packageConfig.homepage);
        editPackage.set('author', packageConfig.author);
        editPackage.set('repository', packageConfig.repository);
        editPackage.set('license', packageConfig.license);
        editPackage.save();

        process.exit();
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
