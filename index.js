import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './router/auth.js';

const app = express();
app.use(cors())
app.use(express.json());


dotenv.config()
const PORT = process.env.PORT || 3000

app.use('/auth',authRouter)

const connectDB = async () => {
    try {
        console.log('Connecting to database...')
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


// if database connected to MongoDB successfully then start listening on port.
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    })
})


