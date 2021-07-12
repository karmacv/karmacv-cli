import { opine } from "https://deno.land/x/opine@1.5.3/mod.ts";
import { CompileService } from "../services/compile.service.ts";
import { ConfigService } from "../services/config.service.ts";
import generate from 'https://x.nest.land/denoname@0.8.2/mod.ts';
const { dirname } = generate(import.meta);

const app = opine();
const compileService = new CompileService();

app.get("/html", async function(req, res) {
    const jsonResume = Deno.readTextFileSync(`/${dirname}/../resume.json`);
    return res.send(await compileService.compileHTML(ConfigService.modulePath, jsonResume, req.params.type));
});

app.get("/html", async function(req, res) {
    return res.send(await compileService.compilePDF());
});

export default app;