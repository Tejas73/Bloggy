import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { jwtStrategy } from './utils/auth';
import userRoute from './routes/user'
import blogRoute from './routes/blog'
import commentRoute from './routes/comment'
import prisma from './utils/prismaClient';


passport.use(jwtStrategy);

const app = express();
app.use(bodyParser.json());

// Middleware to parse cookies
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

async function checkDatabaseConnection() {
    try {
        await prisma.user.findUnique({ where: { email: "any_email@example.com" } })
        console.log("Database connection successful!");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}

app.use('/api/user', userRoute)
app.use('/api/blog', blogRoute)
app.use('/api/comment', commentRoute);

(async () => {
    await checkDatabaseConnection();

    const ORIGIN = process.env.ORIGIN;
    app.listen(ORIGIN, () => {
        console.log(`Server is running on port ${ORIGIN}`);
    });
})();