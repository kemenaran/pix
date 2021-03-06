const { describe, it, before, after, beforeEach, afterEach, expect, knex, nock } = require('../../test-helper');
const server = require('../../../server');
const Answer = require('../../../lib/domain/models/data/answer');

describe('Acceptance | Controller | answer-controller', function () {

  after(function (done) {
    server.stop(done);
  });

  describe('POST /api/answers (update)', function () {

    const options = {
      method: 'POST', url: '/api/answers', payload: {
        data: {
          type: 'answer',
          attributes: {
            value: '1',
            'elapsed-time': 100
          },
          relationships: {
            assessment: {
              data: {
                type: 'assessment',
                id: 'assessment_id'
              }
            },
            challenge: {
              data: {
                type: 'challenge',
                id: 'a_challenge_id'
              }
            }
          }
        }
      }
    };

    beforeEach(function (done) {
      knex('answers').delete().then(() => {
        server.inject(options, () => {
          done();
        });
      });
    });
    afterEach(function (done) {
      knex('answers').delete().then(() => {
        done();
      });
    });

    before(function (done) {
      nock('https://api.airtable.com')
        .get('/v0/test-base/Epreuves/a_challenge_id')
        .times(5)
        .reply(200, {
          'id': 'recLt9uwa2dR3IYpi',
          'fields': {
            'Type d\'épreuve': 'QCU',
            'Bonnes réponses': '1'
            //other fields not represented
          }
        });
      done();
    });

    it('should return 200 HTTP status code', function (done) {
      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('should return application/json', function (done) {
      server.inject(options, (response) => {
        const contentType = response.headers['content-type'];
        expect(contentType).to.contain('application/json');
        done();
      });
    });

    it('should not add a new answer into the database', function (done) {
      server.inject(options, (response) => {
        Answer.count().then((afterAnswersNumber)=>{
          expect(afterAnswersNumber).to.equal(1);
          done();
        });
      });
    });

    it('should return updated answer', function (done) {
      // when
      server.inject(options, (response) => {
        const answer = response.result.data;

        new Answer()
          .fetch()
          .then(function (model) {
            expect(model.id).to.be.a('number');
            expect(model.get('value')).to.equal(options.payload.data.attributes.value);
            expect(model.get('elapsedTime')).to.equal(options.payload.data.attributes['elapsed-time']);
            expect(model.get('result')).to.equal('ok');
            expect(model.get('assessmentId')).to.equal(options.payload.data.relationships.assessment.data.id);
            expect(model.get('challengeId')).to.equal(options.payload.data.relationships.challenge.data.id);

            // then
            expect(answer.id).to.equal(model.id);
            expect(answer.id).to.equal(response.result.data.id);
            expect(answer.attributes.value).to.equal(model.get('value'));
            expect(answer.attributes.result).to.equal(model.get('result'));
            expect(answer.relationships.assessment.data.id).to.equal(model.get('assessmentId'));
            expect(answer.relationships.challenge.data.id).to.equal(model.get('challengeId'));

            done();
          });
      });
    });

  });

});
