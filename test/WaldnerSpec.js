var Waldner = require('../build/Waldner.js');
var chai = require('chai');
var expect = chai.expect;

describe('Booting and connecting to Slack', function() {

  var waldner;

  before(function() {
    // waldner = new Waldner();
  });

  it('Should boot up and connect to Slack', function() {
    expect('waldner').equal('lol');
  });

})
