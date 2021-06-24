import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import logSymbols from 'https://cdn.skypack.dev/log-symbols';
import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
import { ConfigService } from "./config.service.ts";
export class CompileService {

    private readonly configService: ConfigService;

    constructor() {
        this.configService = new ConfigService();
    }

    compileHTML(): Promise<string> {
        const that = this;
        const appRoot = '';
        return new Promise(async function(resolve, reject) {
            try {
                const themeModule = await that.themePkg;
                console.log(themeModule);
                // const jsonData = that.jsonResume;
                let renderedHTML = await themeModule.render(Deno.readTextFileSync('../resume.json'));

                // renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                // renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                // const $renderedDOM = cheerio.load(renderedHTML);
                // const $head = $renderedDOM('head');
                // const injectableJS = Deno.readFileSync(`${appRoot}/server/middleware/client-side.html`).toString();
                // $head.append(injectableJS);
                
                // renderedHTML = $renderedDOM.html();

                resolve(renderedHTML);
            } catch (e) {
                const errorMsg = `couldn't render HTML ${e}`;
                console.log(logSymbols.error, errorMsg);
                reject(errorMsg);
            }
        });
    }
    
    // compileDocx() {
    //     return this.compileHTML().then((html) => {
    //         return htmlToDocxBuffer(html, null, { table: { row: { cantSplit: true } } }, undefined);
    //     }).catch(error => {
    //         const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
    //         console.log(logSymbols.error, errorMsg);
    //     });
    // }
    
    compilePDF(): Promise<any> {
        const convertParameter = {
            displayHeaderFooter: true,
            format: 'A4',
        } as any;
        const that = this;
        return new Promise(function(resolve, reject) {
            that.compileHTML().then(async (compiledHTML) => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(compiledHTML);
                const result = await page.pdf();
                await browser.close();
                resolve(result);
            })
        }).catch((error) => {
            const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
            console.log(logSymbols.error, errorMsg);
        });
    }
    
    get themePkg(): Promise<any> {
        try {
            this.configService.denoModuleUrl = '/Users/emarku/Projekte/resumerise/resumerise-theme-retro/mod.ts';
            return import(this.configService.denoModuleUrl);
        } catch (err) {
            console.log(`No theme found in the current folder. Cause: ${err}`);
            return new Promise(function(resolve, reject) {
                reject(err);
            });
        }
    }
    
    get jsonResume(): string {
        return JSON.parse(Deno.readFileSync(`./resume.json`).toString());
    }
}
