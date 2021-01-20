import * as appRoot from 'app-root-path';
import { injectable } from 'tsyringe';

@injectable()
export class UtilsService {
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

    get themePkg(): any {
        try {
            return require('./index.js');
        } catch (err) {
            // Theme not installed
            console.log('No theme found in the current folder.');
            process.exit();
        }
    }

    initResume() {
        fs.writeFileSync(`${appRoot}/resume.json`, require(`${appRoot}/jsonresume.json`));
        console.log('Your resume.json has been created!');
        console.log('');
        console.log('To generate a formatted .html .md .txt or .pdf resume from your resume.json');
        console.log('type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`');
        console.log('You can optionally specify an available theme for html and pdf resumes using the --theme flag.');
        console.log('Example: `resume export myresume.pdf --theme flat`');
        console.log('Or simply type: `resume export` and follow the prompts.');
        console.log('');

        process.exit();
    }

    get defaultJsonResume(): any {
        return JSON.parse(fs.readFileSync(`${appRoot}/.jsonresume.json`).toString());
    }
}
