import { Service, Inject } from 'https://deno.land/x/mandarinets@v2.3.2/mod.ts';
import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import logSymbols from 'https://cdn.skypack.dev/log-symbols';

@Service()
export class CompileService {

    compileHTML(): Promise<any> {
        const themePkg = ''; // TODO
        const jsonResume = ''; // TODO
        const appRoot = '';
        return new Promise(function(resolve, reject) {
            try {
                const themeModule = themePkg;
                const jsonData = jsonResume;
                const render = {} as any; // themeModule.render;
                let renderedHTML = render(jsonData);
                renderedHTML = renderedHTML.replace('href="//', 'href="http://');
                renderedHTML = renderedHTML.replace('src="//', 'src="http://');
                const $renderedDOM = cheerio.load(renderedHTML);
                const $head = $renderedDOM('head');
                const injectableJS = Deno.readFileSync(`${appRoot}/server/middleware/client-side.html`).toString();
                $head.append(injectableJS);
                resolve($renderedDOM.html());
            } catch (e) {
                const errorMsg = `couldn't render package ${themePkg}`;
                console.log(logSymbols.error, errorMsg);
                reject(errorMsg);
            }
        });
            // concatMap((renderedHTML) => {
            //     return fromPromise(
            //         inlineCss(renderedHTML, {
            //             removeHtmlSelectors: true,
            //             removeStyleTags: true,
            //             url: './',
            //         })
            //     );
            // }),
            // map((inlineHTML) => {
            //     return inlineHTML;
            // }),
            // catchError((error) => {
            //     const errorMsg = `couldn't render package ${this.themePkg}: ${error}`;
            //     console.log(logSymbols.error, errorMsg);
            //     return throwError(error);
            // })
    }
    
    compileDocx() {
        // return new Observable((subject) => {
        //     try {
        //         this.compileHTML().subscribe(async (html) => {
        //             // @ts-ignore
        //             const fileBuffer = await HTMLtoDOCX(html, null, { table: { row: { cantSplit: true } } });
        //             subject.next(fileBuffer);
        //         });
        //     } catch (e) {
        //         const errorMsg = `couldn't render package ${this.themePkg}: ${e}`;
        //         console.log(logSymbols.error, errorMsg);
        //         subject.error(errorMsg);
        //     }
        // });
    }
    
    compilePDF() {
        // return new Observable((subject) => {
        //     try {
        //         const convertParameter = {
        //             displayHeaderFooter: true,
        //             format: 'A4',
        //         } as any;
        //         this.compileHTML().subscribe((html) => {
        //             convertHTMLToPDF(
        //                 html,
        //                 (pdf) => {
        //                     subject.next(pdf);
        //                 },
        //                 convertParameter
        //             );
        //         });
        //     } catch (e) {
        //         const errorMsg = `couldn't render package ${this.themePkg}: ${e}`;
        //         console.log(logSymbols.error, errorMsg);
        //         subject.error(errorMsg);
        //     }
        // });
    }
    
    get themePkg(): any {
        return null;
        // try {
        //     const themePath = this.configService.themePath;
        //     return require(`${themePath}/index.js`);
        // } catch (err) {
        //     console.log(`No theme found in the current folder. Cause: ${err}`);
        //     process.exit();
        // }
    }
    
    get jsonResume(): string {
        // return JSON.parse(Deno.readFileSync(`${appRoot}/resume.json`).toString());
        return '';
    }
}
