import { Controller, GET, Mandarine, ResponseStatus } from 'https://deno.land/x/mandarinets@v2.3.2/mod.ts';
import { CompileService } from '../../../../services/compile.service.ts';

@Controller('/compile')
@ResponseStatus(Mandarine.MandarineMVC.HttpStatusCode.OK)
export class CompileController {
    
    constructor(private readonly compileService: CompileService) {}
    
    @GET('/html')
    public compileHTML(): Promise<string> {
        return this.compileService.compileHTML();
    };
    
    @GET('/pdf')
    public compilePDF(): Promise<any> {
        return this.compileService.compilePDF();
    };
}
