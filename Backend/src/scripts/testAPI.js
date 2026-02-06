#!/usr/bin/env node

import http from 'http';

const BASE_URL = 'http://localhost:5000';

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Running API Tests...\n');

  try {
    // Test 1: GET /api/v1/zones
    console.log('Test 1: GET /api/v1/zones');
    const zonesRes = await makeRequest('/api/v1/zones');
    console.log(`Status: ${zonesRes.statusCode}`);
    if (zonesRes.data.data) {
      console.log(`Zones count: ${zonesRes.data.data.length}`);
      console.log(`Sample zone: ${zonesRes.data.data[0]?.zone_name}\n`);
    }

    // Test 2: GET /api/v1/zones/status
    console.log('Test 2: GET /api/v1/zones/api/status');
    const statusRes = await makeRequest('/api/v1/zones/api/status');
    console.log(`Status: ${statusRes.statusCode}`);
    if (statusRes.data.data) {
      console.log(`Mode: ${statusRes.data.data.mode}`);
      console.log(`Total zones: ${statusRes.data.data.zones?.length}`);
      if (statusRes.data.data.zones[0]) {
        console.log(`Top zone: ${statusRes.data.data.zones[0].zone_name} (WPI: ${statusRes.data.data.zones[0].wpi_score}, Color: ${statusRes.data.data.zones[0].status_color})\n`);
      }
    }

    // Test 3: GET /api/v1/zones/dashboard/summary
    console.log('Test 3: GET /api/v1/zones/api/dashboard/summary');
    const summaryRes = await makeRequest('/api/v1/zones/api/dashboard/summary');
    console.log(`Status: ${summaryRes.statusCode}`);
    if (summaryRes.data.data) {
      console.log(`Total zones: ${summaryRes.data.data.total_zones}`);
      console.log(`Color counts:`, summaryRes.data.data.color_counts);
      console.log(`Blinking zones: ${summaryRes.data.data.blinking_zones}\n`);
    }

    // Test 4: POST /api/v1/zones/mode (switch to event mode)
    console.log('Test 4: POST /api/v1/zones/api/mode');
    const modeRes = await makeRequest('/api/v1/zones/api/mode', 'POST', { mode: 'event' });
    console.log(`Status: ${modeRes.statusCode}`);
    console.log(`Mode switched to: ${modeRes.data.data.mode}\n`);

    // Test 5: GET zone detail
    if (zonesRes.data.data && zonesRes.data.data[0]) {
      const zoneId = zonesRes.data.data[0]._id;
      console.log(`Test 5: GET /api/v1/zones/${zoneId}`);
      const detailRes = await makeRequest(`/api/v1/zones/${zoneId}`);
      console.log(`Status: ${detailRes.statusCode}`);
      if (detailRes.data.data) {
        console.log(`Zone: ${detailRes.data.data.zone?.zone_name}`);
        console.log(`WPI Score: ${detailRes.data.data.status?.wpi_score}`);
        console.log(`Status Color: ${detailRes.data.data.status?.status_color}`);
        console.log(`Breakdown:`, detailRes.data.data.breakdown);
      }
    }

    console.log('\n✅ All tests completed successfully!\n');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Wait for server to start
setTimeout(runTests, 2000);
