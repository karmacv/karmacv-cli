import { inject, singleton } from 'tsyringe';

@singleton()
export class ConfigService {
    themePath: string;
    selectedCompileTarges: Array<string>;
    constructor(@inject('themePath') themePath: string, @inject('selectedCompileTarges') selectedCompileTarges: Array<string>) {
        this.themePath = themePath;
        this.selectedCompileTarges = selectedCompileTarges;
    }
}
