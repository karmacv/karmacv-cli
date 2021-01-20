var builder = require('../core/builder');
var initResume = require('../core/init-e2e');
var assert = require('assert');
var fs = require('fs');

initResume();
const resumeName = 'resume-testing.json';
const jsonResume = JSON.parse(fs.readFileSync('./' + resumeName, 'utf8'));

describe("Rendered HTML document", function(done) {
  it("should contain basic information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        err ? console.log(err) : null;
        assert.ok(html.indexOf(jsonResume.basics.name) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.label) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.picture) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.phone) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.website) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.summary) >= 0);
        done();
      });
  });
  it("should contain location information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        err ? console.log(err) : null;
        assert.ok(html.indexOf(jsonResume.basics.location.address) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.location.postalCode) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.location.city) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.location.countryCode) >= 0);
        assert.ok(html.indexOf(jsonResume.basics.location.region) >= 0);
        done();
      });
  });
  it("should contain profile information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.basics.profiles.forEach(function(profile) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(profile.network) >= 0);
          assert.ok(html.indexOf(profile.username) >= 0);
          assert.ok(html.indexOf(profile.url) >= 0);
        });
        done();
      });
  });
  it("should contain work information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.work.forEach(function(work) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(work.company) >= 0);
          assert.ok(html.indexOf(work.position) >= 0);
          assert.ok(html.indexOf(work.website) >= 0);
          assert.ok(html.indexOf(work.startDate) >= 0);
          assert.ok(html.indexOf(work.endDate) >= 0);
          assert.ok(html.indexOf(work.summary) >= 0);
          work.highlights.forEach(function(highlight) {
            assert.ok(html.indexOf(highlight) >= 0);
          });
        });
        done();
      });
  });
  it("should contain volunteer information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.volunteer.forEach(function(volunteer) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(volunteer.organization) >= 0);
          assert.ok(html.indexOf(volunteer.position) >= 0);
          assert.ok(html.indexOf(volunteer.website) >= 0);
          assert.ok(html.indexOf(volunteer.startDate) >= 0);
          assert.ok(html.indexOf(volunteer.endDate) >= 0);
          assert.ok(html.indexOf(volunteer.summary) >= 0);
          volunteer.highlights.forEach(function(highlight) {
            assert.ok(html.indexOf(highlight) >= 0);
          });
        });
        done();
      });
  });
  it("should contain education information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.education.forEach(function(education) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(education.institution) >= 0);
          assert.ok(html.indexOf(education.area) >= 0);
          assert.ok(html.indexOf(education.studyType) >= 0);
          assert.ok(html.indexOf(education.startDate) >= 0);
          assert.ok(html.indexOf(education.endDate) >= 0);
          assert.ok(html.indexOf(education.gpa) >= 0);
          education.courses.forEach(function(highlight) {
            assert.ok(html.indexOf(highlight) >= 0);
          });
        });
        done();
      });
  });
  it("should contain awards information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.awards.forEach(function(award) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(award.title) >= 0);
          assert.ok(html.indexOf(award.date) >= 0);
          assert.ok(html.indexOf(award.awarder) >= 0);
          assert.ok(html.indexOf(award.summary) >= 0);
        });
        done();
      });
  });
  it("should contain publications information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.publications.forEach(function(publication) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(publication.name) >= 0);
          assert.ok(html.indexOf(publication.publisher) >= 0);
          assert.ok(html.indexOf(publication.releaseDate) >= 0);
          assert.ok(html.indexOf(publication.website) >= 0);
          assert.ok(html.indexOf(publication.summary) >= 0);
        });
        done();
      });
  });
  it("should contain skills information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.skills.forEach(function(skill) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(skill.name) >= 0);
          assert.ok(html.indexOf(skill.level) >= 0);
          skill.keywords.forEach(function(keyword) {
            assert.ok(html.indexOf(keyword) >= 0);
          });
        });
        done();
      });
  });
  it("should contain languages information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.languages.forEach(function(language) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(language.language) >= 0);
          assert.ok(html.indexOf(language.fluency) >= 0);
        });
        done();
      });
  });
  it("should contain interests information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
        jsonResume.interests.forEach(function(interest) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(interest.name) >= 0);
          interest.keywords.forEach(function(keyword) {
            assert.ok(html.indexOf(keyword) >= 0);
          });
        });
        done();
      });
  });
  it("should contain references information", function(done) {
    builder(undefined, undefined, './' + resumeName, function(err, html) {
      jsonResume.references.forEach(function(reference) {
          err ? console.log(err) : null;
          assert.ok(html.indexOf(reference.name) >= 0);
          assert.ok(html.indexOf(reference.reference) >= 0);
        });
        done();
      });
  });
});
