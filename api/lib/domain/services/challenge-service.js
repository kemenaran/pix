const _ = require('../../infrastructure/utils/lodash-utils');
const assessmentService = require('./assessment-service');

function _countResult(about, desiredResult) {
  return _.reduce(about, function(sum, o) {
    return sum + (o.result === desiredResult ? 1 : 0);
  }, 0);
}


module.exports = {

  getKnowledgeData(challengeList) {
    const challengesById = {};
    const knowledgeTagSet = {};
    const nbKnowledgeTagsByLevel = {};
    challengeList.forEach(challenge => {
      if(challenge.knowledgeTags && challenge.knowledgeTags.length > 0) {
        challengesById[challenge.id] = challenge;
        challenge.knowledgeTags.forEach(knowledge => knowledgeTagSet[knowledge] = true);
      }
    });
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(level => nbKnowledgeTagsByLevel[level] = 0);
    console.error('before', nbKnowledgeTagsByLevel);
    for(const knowledgeTag in knowledgeTagSet) {
      const difficulty = assessmentService._getDifficultyOfKnowledge(knowledgeTag);
      nbKnowledgeTagsByLevel[difficulty]++;
    }
    return {
      challengesById,
      knowledgeTagSet,
      nbKnowledgeTagsByLevel
    };
  },

  getRevalidationStatistics(oldAnswers, newAnswers) {

    const oldAnswersResult = _.map(oldAnswers, (o) => { return {id : o.id, result: o.attributes.result};});
    const newAnswersResult = _.map(newAnswers, (o) => { return {id : o.id, result: o.attributes.result};});

    const okNewCount = _countResult(newAnswersResult, 'ok');
    const koNewCount = _countResult(newAnswersResult, 'ko');
    const timedoutNewCount = _countResult(newAnswersResult, 'timedout');
    const partiallyNewCount = _countResult(newAnswersResult, 'partially');
    const abandNewCount = _countResult(newAnswersResult, 'aband');
    const unimplementedNewCount = _countResult(newAnswersResult, 'unimplemented');

    const okOldCount = _countResult(oldAnswersResult, 'ok');
    const koOldCount = _countResult(oldAnswersResult, 'ko');
    const timedoutOldCount = _countResult(oldAnswersResult, 'timedout');
    const partiallyOldCount = _countResult(oldAnswersResult, 'partially');
    const abandOldCount = _countResult(oldAnswersResult, 'aband');
    const unimplementedOldCount = _countResult(oldAnswersResult, 'unimplemented');

    const okDiff = okNewCount - okOldCount;
    const koDiff = koNewCount - koOldCount;
    const timedoutDiff = timedoutNewCount - timedoutOldCount;
    const abandDiff = abandNewCount - abandOldCount;
    const partiallyDiff = partiallyNewCount - partiallyOldCount;
    const unimplementedDiff = unimplementedNewCount - unimplementedOldCount;

    return {
      ok: okNewCount,
      okDiff: okDiff,
      ko: koNewCount,
      koDiff: koDiff,
      timedout: timedoutNewCount,
      timedoutDiff: timedoutDiff,
      aband: abandNewCount,
      abandDiff: abandDiff,
      partially: partiallyNewCount,
      partiallyDiff: partiallyDiff,
      unimplemented: unimplementedNewCount,
      unimplementedDiff: unimplementedDiff
    };

  }

};
