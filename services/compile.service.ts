import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import logSymbols from 'log-symbols';
import { catchError, concatMap, map } from 'rxjs/operators';
import { autoInjectable } from 'tsyringe';
const inlineCss = require('inline-css');
const HTMLtoDOCX = require('html-to-docx');
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

import { ConfigService } from './config.service';
const convertHTMLToPDF = require('pdf-puppeteer');
const cheerio = require('cheerio');

@autoInjectable()
export class CompileService {
    constructor(private readonly configService: ConfigService) {}

    compileHTML(): Observable<any> {
        return new Observable((subject) => {
            try {
                const themeModule = this.themePkg;
                const jsonData = this.jsonResume;
                const render = themeModule.render;
                let renderedHTML = render(jsonData);
                renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                const $renderedDOM = cheerio.load(renderedHTML);
                const $head = $renderedDOM('head');
                const injectableJS = fs.readFileSync(`${appRoot}/server/middleware/client-side.html`).toString();
                $head.append(injectableJS);
                return subject.next($renderedDOM.html());
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
            const themePath = this.configService.themePath;
            return require(`${themePath}/index.js`);
        } catch (err) {
            console.log(`No theme found in the current folder. Cause: ${err}`);
            process.exit();
        }
    }

    get jsonResume(): string {
        return JSON.parse(fs.readFileSync(`${appRoot}/resume.json`).toString());
    }
}
