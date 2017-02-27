const { describe, it } = require('mocha');
const { expect } = require('chai');
const service = require('../../../lib/application/assessments/analysis-utils');


describe('Acceptance | Application | analysis-utils', function () {

  describe('#proba', function () {

    [
      { title: 'theta equals diff', theta: 2, diff: 2, answer: 0.5 },
      { title: 'various arguments are passed', theta: Math.log(0.5), diff: 0, answer: 1/3 },
    ].forEach(testCase => {

      it(`should return ${testCase.answer} when ${testCase.title}`, function () {
        const result = service.proba(testCase.theta, testCase.diff);
        expect(result).to.equal(testCase.answer);
      });
    });

  });

  describe('#derivativeLogLikelihood', function () {

    it('should return a low value when estimated level has been found', function () {
      const result = service.derivativeLogLikelihood(4.5, [{diff: 4, outcome: 1}, {diff: 5, outcome: 0}]);
      expect(result).to.equal(0);
    });

  });
});
