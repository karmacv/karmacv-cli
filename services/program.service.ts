import { UtilsService } from "./utils.service.ts";
import { Program } from "https://deno.land/x/program@0.1.6/mod.ts"

export class ProgramService {
    
    port = 5000;
    program!: Program;
    
    constructor() {
        this.program = new Program({ name: "resumerise-cli", description: 'CLI for resumerise', version: "0.0.1" })
        this.init();
    }

    init() {
        this.program
            .command({name: 'init-schema', description: 'initialize jsonresume schema', fn: () => {
                UtilsService.initResume();
            }})

        this.program
            .command({name: 'serve', description: `Serve resume at http://localhost:${this.port}`, fn: () => {
                UtilsService.startApp();
            }})

        this.program.parse(Deno.args)
    }
}