import chai from 'chai';
const expect = chai.expect;

import Waldner from '../src/waldner/Waldner.js';
import Bot from 'slackbots';

describe('Waldner', () => {

  let waldner;

  before( () => {
    waldner = new Waldner('Waldner', 'Token', 'API') ;
  });

  it('Should boot up and connect to Slack', () => {
  
  });

  it('Shoud have a name', () => {
    expect( waldner.name ).to.equal('Waldner');
  });

  it('Should instantiate Bot', () => {
    expect( waldner.bot ).to.not.be.null;
    expect( waldner.bot ).to.be.an.instanceOf( Bot );
  });

});
