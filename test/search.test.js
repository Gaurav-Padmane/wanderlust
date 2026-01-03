const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Listing = require('../models/listing');

let app;
let mongoServer;

describe('GET /listings/search', function() {
  before(async function() {
    this.timeout(10000);
    // start in-memory mongo
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URL = uri;
    process.env.NODE_ENV = 'test';

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // require the app after the DB connection is configured
    app = require('../app');

    // create some sample listings
    await Listing.create([
      { title: 'Paris Apartment', description: 'Lovely place in Paris', location: 'Paris' },
      { title: 'NY Loft', description: 'Cool Loft', location: 'New York' }
    ]);
  });

  after(async function() {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('returns no results when query is empty', async function() {
    const res = await request(app)
      .get('/listings/search?query=')
      .expect(200);

    expect(res.text).to.include('No listings found');
  });

  it('returns matching results for a non-empty query', async function() {
    const res = await request(app)
      .get('/listings/search?query=Paris')
      .expect(200);

    expect(res.text).to.include('Paris Apartment');
  });
});
