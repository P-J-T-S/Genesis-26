import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../src/app.js';
import { Zone } from '../src/models/zone.model.js';
import { ZoneStatus } from '../src/models/zone_status.model.js';
import { Recommendation } from '../src/models/recommendation.model.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Zone.deleteMany({}),
    ZoneStatus.deleteMany({}),
    Recommendation.deleteMany({}),
  ]);
});

test('POST /api/v1/recommendations/run generates recommendations (event mode)', async () => {
  const zone = await Zone.create({
    zone_name: 'Test Zone',
    geojson: { type: 'Point', coordinates: [0, 0] },
  });

  await ZoneStatus.create({ zone_id: zone._id, wpi_score: 85, mode: 'normal', last_updated: new Date() });

  const res = await request(app).post('/api/v1/recommendations/run').send({ mode: 'event' }).expect(200);

  expect(res.body.status).toBe('ok');
  expect(typeof res.body.total_recommendations).toBe('number');
  expect(res.body.total_recommendations).toBeGreaterThanOrEqual(1);
});

test('GET /api/v1/recommendations/:zoneId returns recent recommendations', async () => {
  const zone = await Zone.create({
    zone_name: 'Test Zone 2',
    geojson: { type: 'Point', coordinates: [1, 1] },
  });

  // Insert a recommendation directly to simulate existing data
  await Recommendation.create({
    zone_id: zone._id,
    recommended_action: 'TEST ACTION',
    reason_text: 'testing',
    actionability_score: 50,
  });

  const res = await request(app).get(`/api/v1/recommendations/${zone._id}`).expect(200);

  expect(res.body.zone_id).toBe(String(zone._id));
  expect(res.body.count).toBeGreaterThanOrEqual(1);
  expect(Array.isArray(res.body.recommendations)).toBe(true);
});
