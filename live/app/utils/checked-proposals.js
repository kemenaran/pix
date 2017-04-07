import _ from 'pix-live/utils/lodash-custom';


function _argumentsAreValids(proposals, definedUserAnswers) {
  return _(definedUserAnswers).isArrayOfBoolean()
            && _(definedUserAnswers).size() <= _(proposals).size()
            && _(proposals).isArrayOfString()
            && !_(proposals).isEmpty();
}

function _normalizeSizeOf(proposals, definedUserAnswers){

  const sizeDifference = _(proposals).size() - _(definedUserAnswers).size();
  const arrayOfFalse = _.times(sizeDifference, _.constant(false));

  return definedUserAnswers.concat(arrayOfFalse);
}

export default function checkedProposals(proposals, answers) {

  answers = _.isNil(answers) ? [] : answers;
  let checkedLabels = [];

  if (_argumentsAreValids(proposals, answers)) {
    const fullSizeUserAnswers = _normalizeSizeOf(proposals, answers);
    checkedLabels = _.zip(proposals,fullSizeUserAnswers);
  }
  return checkedLabels;
}
