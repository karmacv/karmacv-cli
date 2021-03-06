import 'reflect-metadata';

import * as appRoot from 'app-root-path';
import { container } from 'tsyringe';

import { CompileService } from '../../services/compile.service';

const assert = require('assert');
const fs = require('fs');

const jsonResume = JSON.parse(fs.readFileSync(`${appRoot}/resume.json`, 'utf8'));

describe('Rendered HTML document', () => {
    let jsonResumeHTML;

    container.register('selectedCompileTarges', { useValue: '' });
    container.register('themePath', { useValue: `${appRoot}/test/themes/kcv-theme-retro` });

    beforeAll(async (done) => {
        container
            .resolve(CompileService)
            .compileHTML()
            .subscribe((html) => {
                jsonResumeHTML = html;
                done();
            });
    });

    it('should contain resume labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.work) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.volunteer) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.education) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.awards) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.publications) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.skills) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.languages) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.interests) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.resume.references) >= 0);
        done();
    });

    it('should contain basics labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.email) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.phone) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.website) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.summary) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.location) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.basics.profiles) >= 0);
        done();
    });

    it('should contain profile labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.profile.network) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.profile.username) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.profile.url) >= 0);
        done();
    });

    it('should contain location labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.location.address) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.location.postalCode) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.location.city) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.location.countryCode) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.location.region) >= 0);
        done();
    });

    it('should contain award labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.award.title) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.award.date) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.award.awarder) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.award.summary) >= 0);
        done();
    });

    it('should contain interest labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.interest.name) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.interest.keywords) >= 0);
        done();
    });

    it('should contain language labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.language.language) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.language.fluency) >= 0);
        done();
    });

    it('should contain publication labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.publication.name) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.publication.publisher) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.publication.releaseDate) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.publication.website) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.publication.summary) >= 0);
        done();
    });

    it('should contain skill labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.skill.name) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.skill.level) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.skill.keywords) >= 0);
        done();
    });

    it('should contain volunteer labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.organization) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.position) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.website) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.startDate) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.endDate) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.summary) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.volunteer.highlights) >= 0);
        done();
    });

    it('should contain work labels', function (done) {
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.company) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.position) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.website) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.startDate) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.endDate) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.summary) >= 0);
        assert.ok(jsonResumeHTML.indexOf(jsonResume.settings.labels.work.highlights) >= 0);
        done();
    });
});
