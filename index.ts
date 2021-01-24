import 'reflect-metadata';

import * as appRoot from 'app-root-path';
const reload = require('reload');
import { container } from 'tsyringe';
const { Select } = require('enquirer');
import logSymbols from 'log-symbols';

import { UtilsService } from './services/utils.service';
require('dotenv').load({ silent: true });
const pkg = require(appRoot + '/package.json');
const program = require('commander');
const { MultiSelect } = require('enquirer');
const port = 5000;

const livereload = require('livereload');

const liveReloadServer = livereload.createServer();

program.usage('[command] [options]').version(pkg.version).option('-p, --port <port>', 'Used by `serve`', 5000);

program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function () {
        container.resolve(UtilsService).initResume();
    });

program
    .command('serve')
    .description(`Serve resume at http://localhost:${port}`)
    .action(function () {
        const themes = container.resolve(UtilsService).findThemes([`${appRoot}/test/themes/kcv-theme-retro`]);
        if (themes.length) {
            const prompt = new Select({
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
            prompt
                .run()
                .then((path) => {
                    container.register('themePath', { useValue: `${path}` });
                    const prompt = new MultiSelect({
                        name: 'value',
                        message: 'Choose your compilation target',
                        choices: [
                            {
                                message: `http://localhost:${port}/html`,
                                name: `http://localhost:${port}/html`,
                                value: `http://localhost:${port}/html`,
                            },
                            {
                                message: `http://localhost:${port}/pdf`,
                                name: `http://localhost:${port}/pdf`,
                                value: `http://localhost:${port}/pdf`,
                            },
                        ],
                    });
                    prompt
                        .run()
                        .then((compilationTargets) => {
                            container.register('selectedCompileTarges', { useValue: compilationTargets });
                            container.resolve(UtilsService).startApp(port).listen();
                        })
                        .catch(console.error);
                })
                .catch(console.error);
        } else {
            console.log(logSymbols.info, `No themes found.`);
        }
    });

program.parse(process.argv);

const validCommands = program.commands.map(function (cmd) {
    return cmd._name;
});

if (!program.args.length) {
    program.help();
} else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log('Invalid argument:', process.argv[2]);
    program.help();
}
