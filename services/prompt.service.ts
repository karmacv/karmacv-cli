import * as appRoot from 'app-root-path';
import logSymbols from 'log-symbols';
import { container, injectable } from 'tsyringe';

import { DocType } from '../models/doc-type.model';
import { ThemePathModel } from '../models/theme-path.model';
import { UtilsService } from './utils.service';
const { Select } = require('enquirer');
const { MultiSelect } = require('enquirer');

@injectable()
export class PromptService {
    promptSelectTheme(themes: ThemePathModel[]): any {
        return new Select({
            name: 'path',
            message: 'Choose a theme',
            choices: themes.map((item) => {
                const path = item.path.replace('/package.json', '');
                return {
                    name: path,
                    message: item.name,
                    value: path,
                };
            }),
        });
    }

    promptOpenWebPage(port: number) {
        return new MultiSelect({
            name: 'value',
            message: 'Choose your compilation target',
            initial: [DocType.HTML.toString(), DocType.PDF.toString()],
            choices: [
                {
                    message: UtilsService.getServeUrl(port, DocType.HTML.toString()),
                    name: DocType.HTML.toString(),
                    value: UtilsService.getServeUrl(port, DocType.HTML.toString()),
                },
                {
                    message: UtilsService.getServeUrl(port, DocType.PDF.toString()),
                    name: DocType.PDF.toString(),
                    value: UtilsService.getServeUrl(port, DocType.PDF.toString()),
                },
            ],
        });
    }

    init(port: number) {
        const themes = this.localThemes;
        if (themes.length) {
            const selectThemePrompt = this.promptSelectTheme(themes);
            selectThemePrompt
                .run()
                .then((path) => {
                    container.register('themePath', { useValue: `${path}` });
                    const openUrlPrompt = this.promptOpenWebPage(port);
                    openUrlPrompt
                        .run()
                        .then((data) => {
                            const urls = data.map((item) => {
                                return UtilsService.getServeUrl(port, DocType[item].toString());
                            });
                            container.register('selectedCompileTarges', { useValue: urls });
                            container.resolve(UtilsService).startApp(port).listen();
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        } else {
            console.log(logSymbols.info, `No themes found.`);
        }
    }

    get localThemes(): ThemePathModel[] {
        return container.resolve(UtilsService).findThemes([`${appRoot}/test/themes/kcv-theme-retro`]);
    }
}
