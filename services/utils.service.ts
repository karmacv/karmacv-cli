import { appRoot } from 'https://cdn.skypack.dev/app-root-path';
import { FileHound } from 'https://cdn.skypack.dev/filehound';
import { fse } from 'https://cdn.skypack.dev/fs-extra'
import { editJsonFile } from "https://cdn.skypack.dev/edit-json-file";
import { Service, Inject } from 'https://deno.land/x/mandarinets@v2.3.2/mod.ts';
import { ThemePathModel } from '../models/theme-path.model';
import { ExpressApp } from '../server/express.app';
import { CompileController } from '../server/middleware/compile-controller';
import { PromptService } from './prompt.service';

@Service()
export class UtilsService {

    constructor(private readonly compileController: CompileController,
                private readonly promptService: PromptService) {
    }

    startApp(port: number) {
        return new ExpressApp(port, [this.compileController]);
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
        this.promptService
            .createTemplate()
            .run()
            .then((answer: any) => {
                this.initMainTemplate(JSON.parse(answer.result));
            })
            .catch(console.error);
    }

    initMainTemplate(packageConfig: any) {
        const targetPath = `${Deno.cwd()}/${packageConfig.name}`;
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
    }

    extractFileFormat(fileName: string) {
        const dotPos = fileName.lastIndexOf('.');
        if (dotPos === -1) {
            return null;
        }
        return fileName.substring(dotPos + 1).toLowerCase();
    }

    initResume() {
        Deno.writeFileSync(`${appRoot}/resume.json`, Deno.readFileSync(`${appRoot}/jsonresume.json`));
    }

    findThemes(searchPath: string = './'): ThemePathModel[] | undefined {
        try {
            const files = FileHound.create().depth(2).path(searchPath).match('package.json').findSync();
            return files
                .filter((path: string) => {
                    try {
                        return JSON.parse(Deno.readFileSync(path).toString()).name?.includes('kcv-theme');
                    } catch (e) {
                        return false;
                    }
                })
                .map((path: string) => {
                    const absolutePath = path.replace('/package.json', '');
                    return {
                        name: JSON.parse(Deno.readFileSync(path).toString()).name,
                        path: absolutePath,
                    } as ThemePathModel;
                });
        } catch (e) {
            console.log(`Invalid path: ${e.message}`);
            return undefined;
        }
    }

    getServeUrl(port: number, path: string) {
        return `http://localhost:${port}/${path}`;
    }
}
