import { Service, Inject } from 'https://deno.land/x/mandarinets@v2.3.2/mod.ts';
import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import logSymbols from 'https://cdn.skypack.dev/log-symbols';
import inlineCss from 'https://cdn.skypack.dev/inline-css';
import htmlToDocxBuffer from 'https://cdn.skypack.dev/html-to-docx-buffer';
import convertHTMLToPDF from 'https://cdn.skypack.dev/pdf-puppeteer';

@Service()
export class CompileService {

    compileHTML(): Promise<string> {
        const that = this;
        const appRoot = '';
        return new Promise(async function(resolve, reject) {
            try {
                const themeModule = that.themePkg;
                const jsonData = that.jsonResume;
                const render = themeModule.render;
                let renderedHTML = render(jsonData);

                renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                const $renderedDOM = cheerio.load(renderedHTML);
                const $head = $renderedDOM('head');
                const injectableJS = Deno.readFileSync(`${appRoot}/server/middleware/client-side.html`).toString();
                $head.append(injectableJS);
                
                renderedHTML = $renderedDOM.html();

                const inlinedHTML = await inlineCss(renderedHTML, {
                    removeHtmlSelectors: true,
                    removeStyleTags: true,
                    url: './',
                }) as string;

                resolve(inlinedHTML);
            } catch (e) {
                const errorMsg = `couldn't render package ${that.themePkg}`;
                console.log(logSymbols.error, errorMsg);
                reject(errorMsg);
            }
        });
    }
    
    compileDocx() {
        return this.compileHTML().then((html) => {
            return htmlToDocxBuffer(html, null, { table: { row: { cantSplit: true } } }, undefined);
        }).catch(error => {
            const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
            console.log(logSymbols.error, errorMsg);
        });
    }
    
    compilePDF() {
        const convertParameter = {
            displayHeaderFooter: true,
            format: 'A4',
        } as any;
        const that = this;
        return new Promise(function(resolve, reject) {
            that.compileHTML().then(async (compiledHTML) => {
                // resolved via callback
                await convertHTMLToPDF(
                    compiledHTML,
                            (pdf: any) => {
                                resolve(pdf);
                            },
                            convertParameter
                        );   
            })

        }).catch((error) => {
            const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
            console.log(logSymbols.error, errorMsg);
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
        return JSON.parse(Deno.readFileSync(`${appRoot}/resume.json`).toString());
    }
}
