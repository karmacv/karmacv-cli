import { Controller, GET } from 'https://deno.land/x/mandarinets@v2.3.2/mod.ts';

@Controller()
export class CompileController {
    @GET('/html')
    compileHTML = async (req, res) => {
        this.compileService.compileHTML().subscribe(
            (data) => {
                res.set('Content-Type', 'text/html');
                res.status(200).send(data);
            },
            (error) => {
                res.status(500).send(error);
            }
        );
    };
    
    @GET('/pdf')
    compilePDF = async (req, res) => {
        this.compileService.compilePDF().subscribe(
            (data) => {
                res.set('Content-Type', 'application/pdf');
                res.status(200).send(data);
            },
            (error) => {
                res.status(500).send(error);
            }
        );
    };
}
