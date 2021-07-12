import logSymbols from 'https://cdn.skypack.dev/log-symbols';
import { ConfigService } from "./config.service.ts";
import generate from 'https://x.nest.land/denoname@0.8.2/mod.ts';
import * as eta from 'https://deno.land/x/eta@v1.6.0/mod.ts';
import htmlToDocxBuffer from 'https://cdn.skypack.dev/html-to-docx-buffer';
const { dirname } = generate(import.meta);
export class CompileService {

    private readonly configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    async compileHTML(themePath: string, json: string, type: string): Promise<string> {
        try {
            const themeModule = await this.getThemePkg(themePath);
            let renderedHTML = await themeModule.render(json, type);
            renderedHTML = await this.embedRenderedHTML(renderedHTML, 'test');
            return renderedHTML;
        } catch (e) {
            const errorMsg = `couldn't render HTML ${e}`;
            console.log(logSymbols.error, errorMsg);
            return new Promise(function(_, reject) {
                reject(errorMsg);
            });
        }
    }
    
    compileDocx(themePath: string, json: string) {
        return this.compileHTML(themePath, json, 'PDF').then((html) => {
            return htmlToDocxBuffer(html, null, { table: { row: { cantSplit: true } } }, undefined);
        }).catch(error => {
            const errorMsg = `couldn't render package ${themePath}: ${error}`;
            console.log(logSymbols.error, errorMsg);
        });
    }
    
    compilePDF(themePath: string, json: string): Promise<any> {
        const convertParameter = {
            displayHeaderFooter: true,
            format: 'A4',
        };
        return new Promise(function(resolve, reject) {
            that.compileHTML(themePath, json, 'PDF').then(async (compiledHTML) => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(compiledHTML);
                const result = await page.pdf();
                await browser.close();
                resolve(result);
            })
        }).catch((error) => {
            const errorMsg = `couldn't render package ${themePath}`;
            console.log(logSymbols.error, errorMsg);
        });
    }
    
    getThemePkg(themePath: string): Promise<any> {
        try {
            return import(themePath);
        } catch (err) {
            console.log(`Error while import theme ${themePath}. Reason: ${err}`);
            return new Promise(function(_, reject) {
                reject(err);
            });
        }
    }
    
    get jsonResume(): string {
        return JSON.parse(Deno.readFileSync(`./resume.json`).toString());
    }

    embedRenderedHTML(renderedHTML: string, title: string): string | Promise<string> | void {
        var mainLayout = Deno.readTextFileSync(`/${dirname}/../server/templates/layout.eta`);
        return eta.render(mainLayout, {
            content: renderedHTML,
            title: title
        });
    }
}
