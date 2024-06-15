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
    origin: "http://localhost:5173", 
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
        process.exit(1); // Exit the application if connection fails
    }
}   

// Define your routes here...
app.use('/api/user', userRoute)
app.use('/api/blog', blogRoute)
app.use('/api/comment', commentRoute);

(async () => {
    await checkDatabaseConnection();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();