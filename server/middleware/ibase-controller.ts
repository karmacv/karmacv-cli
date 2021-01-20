export abstract class IBaseController {
    abstract initRoutes(): any;
    abstract initRoutes();
    abstract basePath: string;

    constructor() {
        this.initRoutes();
    }
}
