var chai = require('chai');
var assert = chai.assert;

global.ethereumProvider = {bzz: 'http://givenProvider:8500'};


describe('Web3.providers.givenProvider', function () {
    describe('should be set if ethereumProvider is available ', function () {

        it('when instantiating Web3', function () {

            var Web3 = require('../packages/sweb3js');

            assert.deepEqual(Web3.givenProvider, global.ethereumProvider);

        });

        it('when instantiating Eth', function () {

            var Eth = require('../packages/sweb3-eth');

            assert.deepEqual(Eth.givenProvider, global.ethereumProvider);

        });

        it('when instantiating Bzz', function () {

            var Bzz = require('../packages/sweb3-bzz');

            assert.deepEqual(Bzz.givenProvider, global.ethereumProvider.bzz);

        });

    });
});

