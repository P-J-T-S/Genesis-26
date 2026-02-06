import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database/connect.js';
import { app } from './app.js';

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT : ${ process.env.PORT }`);
    });
});