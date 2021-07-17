import app from "../server/app.ts";
export class UtilsService {
  startApp() {
    app.listen(3000, () => {
      console.log("server has started on http://localhost:3000 🚀");
    });
  }
}
