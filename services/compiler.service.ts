import 'reflect-metadata';

import * as appRoot from 'app-root-path';
import btoa from 'btoa';
import { Observable } from 'rxjs';
import { autoInjectable, container } from 'tsyringe';

import { ConfigService } from './config.service';

const themeServer = process.env.THEME_SERVER || 'https://themes.jsonresume.org/theme/';
const registryServer = process.env.REGISTRY_SERVER || 'https://registry.jsonresume.org';
const request = require('superagent');
const http = require('http');
const fs = require('fs');
const path = require('path');
const read = require('read');
const spinner = require('char-spinner');
const chalk = require('chalk');
const puppeteer = require('puppeteer');

const SUPPORTED_FILE_FORMATS = ['html', 'pdf'];

@autoInjectable()
export class CompilerService {
    renderHtml(): Observable<string> {
        return new Observable((subscriber) => {
            try {
                const resumeJson = this.jsonResume;
                const themePkg = this.themePkg;
                const contents = themePkg.render(resumeJson);
                return subscriber.next(contents);
            } catch (e) {
                return subscriber.error(e);
            }
        });
    }

    async createPdf(resumeJson: any, fileName: string): Promise<Buffer> {
        const html = await this.renderHtml().toPromise();
        const themePkg = this.themePkg;
        const puppeteerLaunchArgs = [];

        if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
            puppeteerLaunchArgs.push('--no-sandbox');
        }

        const browser = await puppeteer.launch({
            args: puppeteerLaunchArgs,
        });
        const page = await browser.newPage();

        await page.emulateMedia((themePkg.pdfRenderOptions && themePkg.pdfRenderOptions.mediaType) || 'screen');
        await page.goto(`data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            path: `${fileName}.pdf`,
            format: 'Letter',
            printBackground: true,
            ...themePkg.pdfRenderOptions,
        });
        await browser.close();
        return pdf;
    }

    get themePkg(): any {
        try {
            const themePath = container.resolve(ConfigService).themePath;
            return require(`${themePath}/index.js`);
        } catch (err) {
            // Theme not installed
            console.log('No theme found in the current folder.');
            process.exit();
        }
    }

    get jsonResume(): string {
        return JSON.parse(fs.readFileSync(`${appRoot}/resume.json`).toString());
    }
}
