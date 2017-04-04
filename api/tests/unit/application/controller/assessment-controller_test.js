const { describe, it, beforeEach, afterEach, expect, sinon } = require('../../../test-helper');

const assessmentController = require('../../../../lib/application/assessments/assessment-controller');

const assessmentService = require('../../../../lib/domain/services/assessment-service');
const assessmentSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/assessment-serializer');
const Boom = require('boom');


describe('Unit | Controller | assessment-controller', () => {

  describe('#get', () => {

    const reply = sinon.spy();
    let getScoredAssessmentStub;
    let assessmentSerializerStub;
    let request = { params: { id: 12 } };

    beforeEach(() => {
      getScoredAssessmentStub = sinon.stub(assessmentService, 'getScoredAssessment').resolves();
      assessmentSerializerStub = sinon.stub(assessmentSerializer, 'serialize');
    });

    afterEach(() => {
      getScoredAssessmentStub.restore();
      assessmentSerializerStub.restore();
    });

    it('checks sanity', () => {
      expect(assessmentController.get).to.exist;
    });

    it('should call AssessementService#getScoredAssessment with request param', () => {
      // given
      request = { params: { id: 1234567 } };

      // when
      assessmentController.get(request, reply);

      // then
      sinon.assert.calledWithExactly(getScoredAssessmentStub, 1234567);
    });

    it('should return a Bad Implementation error when we cannot retrieve the score', () => {
      // given
      const expectedError = { error: 'Expected API Return ' };

      let boomBadImplementationStub = sinon.stub(Boom, 'badImplementation').returns(expectedError);
      getScoredAssessmentStub.rejects(new Error('Expected Error Message'));

      // when
      let promise = assessmentController.get(request, reply);

      // then
      return promise.then(() => {
        boomBadImplementationStub.restore();
        sinon.assert.calledWithExactly(reply, expectedError);
      });
    });

    it('should reply with the scored assessment', () => {
      // given
      const serializedAssessment = { data: { type: 'assessement' } };
      const scoredAssessement = { id: 'assessment_id' };

      assessmentSerializerStub.returns(serializedAssessment);
      getScoredAssessmentStub.resolves(scoredAssessement);

      // when
      let promise = assessmentController.get(request, reply);

      // then
      return promise.then(() => {
        sinon.assert.calledWithExactly(assessmentSerializerStub, scoredAssessement);
        sinon.assert.calledWithExactly(reply, serializedAssessment);
      });
    });

  });

});
