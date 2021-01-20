import * as appRoot from 'app-root-path';
import { container } from 'tsyringe';

import { ExpressApp } from './server/express.app';
import { UtilsService } from './services/utils.service';
require('dotenv').load({ silent: true });
const pkg = require(appRoot + '/package.json');
const program = require('commander');

program.usage('[command] [options]').version(pkg.version).option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000);

program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function () {
        container.resolve(UtilsService).initResume();
    });

program
    .command('serve')
    .description('Serve resume at http://localhost:4000/')
    .action(function () {
        container.resolve(ExpressApp).listen(program.port);
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
