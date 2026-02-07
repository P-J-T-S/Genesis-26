import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Zone } from './models/zone.model.js';
import { computeAllZonesWPI, rankZonesByPriority } from './services/wpi.service.js';

async function verifyWPI() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);

        const results = await computeAllZonesWPI('normal');
        const ranked = rankZonesByPriority(results);

        console.log('--- WPI & PRIORITY VERIFICATION ---');
        ranked.forEach(z => {
            console.log(`Rank: ${z.priority_rank}, Name: ${z.name}, WPI: ${z.wpi}, Status: ${z.pressureLevel}`);
        });
        console.log('-----------------------------------');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

verifyWPI();
