import * as appRoot from 'app-root-path';
import logSymbols from 'log-symbols';
import { container, injectable } from 'tsyringe';

import { DocType } from '../models/doc-type.model';
import { ThemePathModel } from '../models/theme-path.model';
import { UtilsService } from './utils.service';
const { Select } = require('enquirer');
const { MultiSelect } = require('enquirer');
const { Snippet } = require('enquirer');
const semver = require('semver');
const slugify = require('@matters/slugify');

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

    createTemplate() {
        const prompt = new Snippet({
            name: 'username',
            message: 'Fill out the fields in package.json',
            required: true,
            fields: [
                {
                    name: 'author_name',
                    message: 'Author Name',
                },
                {
                    name: 'version',
                    validate(value, state, item, index) {
                        if (item && item.name === 'version' && !semver.valid(value)) {
                            return prompt.styles.danger('version should be a valid semver value');
                        }
                        return true;
                    },
                },
                {
                    name: 'name',
                    validate(value, state, item, index): any | boolean {
                        if (slugify(value) != value) {
                            return prompt.styles.danger(`please check the package name, this should be correctly formatted: "kcv-${slugify(value)}"`);
                        }
                        return true;
                    },
                },
            ],
            template: `{
              "name": "kcv-\${name}",
              "description": "\${description}",
              "version": "\${version}",
              "homepage": "https://github.com/\${username}/\${name}",
              "author": "\${author_name} (https://github.com/\${username})",
              "repository": "\${username}/\${name}",
              "license": "\${license:ISC}"
            }
            `,
        });
        return prompt;
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
