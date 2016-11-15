const Boom = require('boom');
const challengeRepository = require('../../infrastructure/repositories/challenge-repository');
const challengeSerializer = require('../../infrastructure/serializers/challenge-serializer');

module.exports = {

  list(request, reply) {

    challengeRepository
      .list()
      .then((challenges) => reply(challengeSerializer.serializeArray(challenges)))
      .catch((err) => reply(Boom.badImplementation(err)));
  },

  get(request, reply) {

    challengeRepository
      .get(request.params.id)
      .then((challenge) => reply(challengeSerializer.serialize(challenge)))
      .catch((err) => reply(Boom.badImplementation(err)));
  },

  refresh(request, reply) {

    challengeRepository
      .refresh(request.params.id)
      .then((challenge) => reply(challengeSerializer.serialize(challenge)))
      .catch((err) => reply(Boom.badImplementation(err)));
  }

};
