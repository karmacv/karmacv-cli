import { opine } from "https://deno.land/x/opine@1.5.3/mod.ts";
import { CompileService } from "../services/compile.service.ts";

const app = opine();
const compileService = new CompileService();

app.get("/html", async function(req, res) {
    return res.send(await compileService.compileHTML());
});

app.get("/html", async function(req, res) {
    return res.send(await compileService.compilePDF());
});

app.listen(3000, () => console.log("server has started on http://localhost:3000 🚀"));