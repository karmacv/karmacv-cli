import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import logSymbols from 'log-symbols';
import { catchError, concatMap, map } from 'rxjs/operators';
import { container, injectable } from 'tsyringe';
const inlineCss = require('inline-css');
const HTMLtoDOCX = require('html-to-docx');
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

import { ConfigService } from './config.service';
const convertHTMLToPDF = require('pdf-puppeteer');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');

@injectable()
export class CompileService {
    compileHTML(): Observable<any> {
        return new Observable((subject) => {
            try {
                const themeModule = this.themePkg;
                const jsonData = this.jsonResume;
                const socketScript = fs.readFileSync(`${appRoot}/server/middleware/client-side.html`).toString();
                const render = themeModule.render;
                let renderedHTML = render(jsonData);
                renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                subject.next(renderedHTML);
            } catch (e) {
                const errorMsg = `couldn't render package ${this.themePkg}`;
                console.log(logSymbols.error, errorMsg);
                subject.error(errorMsg);
            }
        }).pipe(
            concatMap((renderedHTML) => {
                return fromPromise(
                    inlineCss(renderedHTML, {
                        removeHtmlSelectors: true,
                        removeStyleTags: true,
                        url: './',
                    })
                );
            }),
            map((inlineHTML) => {
                return inlineHTML;
            }),
            catchError((error) => {
                const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
                console.log(logSymbols.error, errorMsg);
                return throwError(error);
            })
        );
    }

    compileDocx() {
        return new Observable((subject) => {
            try {
                this.compileHTML().subscribe(async (html) => {
                    // @ts-ignore
                    const fileBuffer = await HTMLtoDOCX(html, null, { table: { row: { cantSplit: true } } });
                    subject.next(fileBuffer);
                });
            } catch (e) {
                const errorMsg = `couldn't render package ${this.themePkg}: ${e}`;
                console.log(logSymbols.error, errorMsg);
                subject.error(errorMsg);
            }
        });
    }

    compilePDF() {
        return new Observable((subject) => {
            try {
                const convertParameter = {
                    displayHeaderFooter: true,
                    format: 'A4',
                } as any;
                this.compileHTML().subscribe((html) => {
                    convertHTMLToPDF(
                        html,
                        (pdf) => {
                            subject.next(pdf);
                        },
                        convertParameter
                    );
                });
            } catch (e) {
                const errorMsg = `couldn't render package ${this.themePkg}: ${e}`;
                console.log(logSymbols.error, errorMsg);
                subject.error(errorMsg);
            }
        });
    }

    get themePkg(): any {
        try {
            const themePath = container.resolve(ConfigService).themePath;
            return require(`${themePath}/index.js`);
        } catch (err) {
            // Theme not installed
            console.log('No theme found in the current folder.');
            process.exit();
        }
    }

    get jsonResume(): string {
        return JSON.parse(fs.readFileSync(`${appRoot}/resume.json`).toString());
    }
}
