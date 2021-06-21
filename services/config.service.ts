import { Service } from "https://deno.land/x/mandarinets@v2.3.2/mod.ts";

@Service()
export class ConfigService {
    denoModuleUrl!: string;
}