import { opine } from "https://deno.land/x/opine@1.5.3/mod.ts";
import { ConfigService } from "../services/config.service.ts";
import {
  compileHTML,
  compilePDF,
  getDefaultResume,
} from "../../resumerise-theme-library/mod.ts";
import { DocType } from "../../resumerise-theme-library/models/doc-type.model.ts";

const app = opine();

app.get("/html", async function (req, res) {
  return res.send(
    await compileHTML(
      ConfigService.modulePath,
      getDefaultResume(),
      req.params.type as DocType,
    ),
  );
});

app.get("/pdf", async function (_, res) {
  return res.send(
    await compilePDF(
      ConfigService.modulePath,
      getDefaultResume(),
    ),
  );
});

export default app;
