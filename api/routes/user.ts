//convert into ts
import express from 'express';
import prisma from '../utils/prismaClient';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/hashPswrd';
import passport from 'passport';
import { User } from '@prisma/client';

const router = express.Router()

interface UserFields{
    email: string,
    password: string
}

interface ProfileFields{
    name: string,
    bio: string
}

router.post("/signup", async (req:express.Request<{},{},UserFields>, res:express.Response) => {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    if (hashedPassword === null) {
        return res.status(500).json({ error: "Error hashing password, possibly null" })
    }
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        })
        res.status(201).json({ message: "Signup successful", user })
    } catch (error) {
        console.error("Signup unsuccessful: ", error)
        res.status(500).json({ error: "Signup unsuccessful" })
    }
})

router.get("/signin", async (req: express.Request<{},{},UserFields>,  res:express.Response) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Missing email" })
    }
    else if (!password) {
        return res.status(400).json({ message: "Missing password" })
    }

    const user = await prisma.user.findUnique({
        where: {email}
    })
    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const validatePassword = await bcrypt.compare(password, user.password)
    if (!validatePassword) {
        return res.status(400).json({ message: "Incorrect email or password" })
    }

    const payload = { userId: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : "", { expiresIn: "1h" })

    if (!process.env.JWT_SECRET) {
        return res.json({ message: "Error: JWT_SECRET is empty or not set" })
    }

    res.cookie("jwt", token, { httpOnly: true, secure: true })
    res.json({ message: 'Login successful', user })
})

router.put("/profile", passport.authenticate('jwt', { session: false }), async (req: express.Request<{},{},ProfileFields>,  res:express.Response) => {
    try {
        const { name, bio } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: (req.user as User).id },
            data: {
                profile: {
                    update: {
                        name,
                        bio
                    },
                },
            },
            include: { profile: true }
        });

        if (!updatedUser) {
            return res.status(500).json({ message: "Error updating profile" })
        }

        res.json({ message: "Profile updated successfully", user: updatedUser })

    } catch (error) {
        console.error("Error in profile route: ", error)
    }
})


export default router;