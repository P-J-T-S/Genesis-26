import express from 'express';
import { identifyHotspots } from '../services/hotspot.service.js';
import { detectSpikes } from '../services/spike.service.js';

const router = express.Router();

router.post('/hotspots', async (req, res) => {
  await identifyHotspots();
  res.json({
    status: 'ok',
    task: 'hotspot_identification',
  });
});

router.post('/spikes', async (req, res) => {
  await detectSpikes();
  res.json({
    status: 'ok',
    task: 'spike_detection',
  });
});

router.post('/run', async (req, res) => {
  await identifyHotspots();
  await detectSpikes();
  res.json({
    status: 'ok',
    intelligence: 'all updated',
  });
});

export default router;
