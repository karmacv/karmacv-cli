import { MandarineCore } from "https://deno.land/x/mandarinets@v2.3.2/mod.ts";
import { CompileController } from "../src/main/mandarine/controllers/compile-controller.ts";
import { CompileService } from "./compile.service.ts";
import { ConfigService } from "./config.service.ts";

export class UtilsService {

    static initResume() {
        // TODO: create jsonresume.json
        Deno.writeFileSync(`./resume.json`, Deno.readFileSync(`./jsonresume.json`));
    }

    static getServeUrl(port: number, path: string) {
        return `http://localhost:${port}/${path}`;
    }

    static startApp() {
        const controllers = [CompileController];
        const services = [CompileService, ConfigService];
        const middleware = [];
        const repositories = [];
        const configurations = [];
        const components = [];
        const otherModules = [];
        new MandarineCore().MVC().run();
    }
}
