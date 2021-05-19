import 'reflect-metadata';

import * as appRoot from 'app-root-path';
import { container } from 'tsyringe';

import { PromptService } from './services/prompt.service';
import { UtilsService } from './services/utils.service';

require('dotenv').load({ silent: true });
const pkg = require(appRoot + '/package.json');
const program = require('commander');
const port = 5000;

program.usage('[command] [options]').version(pkg.version);

program
    .command('init-schema')
    .description('Initialize a resume.json file')
    .action(function () {
        container.resolve(UtilsService).initResume();
    });

program
    .command('init-theme')
    .description('Initialize a new template')
    .action(function () {
        container.resolve(UtilsService).createTheme();
    });

program
    .command('serve')
    .option('--port <port>', 'Port of the server', 5000)
    .option('--path <path>', 'Path to the theme', './')
    .description(`Serve resume at http://localhost:${port}`)
    .action((port, path) => {
        port = port && port instanceof Number ? port : 5000;
        path = path && path instanceof String ? path : './';
        container.resolve(PromptService).init(port, path);
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
