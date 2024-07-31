// set secure:true for PRODUCTION in signin route
import express from 'express';
import prisma from '../utils/prismaClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../utils/hashPswrd';
import passport from 'passport';
import { User } from '@prisma/client';


const router = express.Router()

interface UserFields {
    email: string,
    password: string,
    profile: {
        name: string,
        bio: string
    }
}
interface ProfileFields {
    name: string,
    bio: string
}

interface UpdateFields {
    updatedEmail: string,
    updatedPassword: string
    updatedName: string,
    updatedBio: string
}

// route to signup
router.post("/signup", async (req: express.Request<{}, {}, UserFields>, res: express.Response) => {
    console.log(req.body)
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    if (hashedPassword === null) {
        return res.status(500).json({ error: "Error hashing password, possibly null" })
    }

    try {
        console.log(hashedPassword)
        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                profile: {
                    create: {
                        name: "",
                        bio: ""
                    }
                }
            }
        })
        const payload = { userId: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : "", { expiresIn: "1h" })
        res.status(201).json({ message: "Signup successful", token })
    }

    catch (error) {
        console.error("Signup unsuccessful: ", error)
        res.status(500).json({ error: "Signup unsuccessful" })
    }
})

// route to fetch profile credentials
router.get("/myprofile", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, ProfileFields>, res: express.Response) => {
    try {
        const userId = (req.user as User).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user || !user.profile) {
            return res.status(404).json({ message: "Profile not found" })
        }

        const profileData: UserFields = {
            email: user.email,
            password: user.password,
            profile: {
                name: user.profile.name,
                bio: user.profile.bio,
            }
        }
        console.log(profileData)
        res.json(profileData);

    } catch (error) {
        console.error("Error in fetching profile details: ", error)
    }
})

//router to edit an email in MyProfile.tsx
router.put("/updateemail", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, UpdateFields>, res: express.Response) => {
    try {
        const { updatedEmail } = req.body

        const updateEmail = await prisma.user.update({
            where: { id: (req.user as User).id },
            data: {
                email: updatedEmail
            }
        })

        if (!updateEmail) {
            return res.status(500).json({ message: "updateEmail not found" })
        }

        res.json({ message: "Profile email updated successfully", profile: updateEmail })

    } catch (error) {
        console.error("Error in updating email: ", error)
    }
})

//router to edit a password in MyProfile.tsx
router.put("/updatepassword", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, UpdateFields>, res: express.Response) => {
    try {
        const { updatedPassword } = req.body;
        const hashedUpdatedPassword = await hashPassword(updatedPassword);

        if (hashedUpdatedPassword === null) {
            return res.status(500).json({ error: "Error hashing password, possibly null" })
        }

        const updatePassword = await prisma.user.update({
            where: { id: (req.user as User).id },
            data: {
                password: hashedUpdatedPassword
            }
        })

        if (!updatePassword) {
            return res.status(500).json({ message: "updatePassword not found" })
        }
        console.log("updatePassword:", updatePassword)
        res.json({ message: "Profile password updated successfully", profile: updatePassword })

    } catch (error) {
        console.error("Error in updating password: ", error)
    }
})

//router to edit a name in MyProfile.tsx
router.put("/updatename", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, UpdateFields>, res: express.Response) => {
    try {
        const { updatedName } = req.body

        const updateName = await prisma.profile.update({
            where: { userId: (req.user as User).id },
            data: {
                name: updatedName
            }
        })

        if (!updateName) {
            return res.status(500).json({ message: "Error updating name in myprofile" })
        }

        res.json({ message: "Profile updated successfully", profile: updateName })

    } catch (error) {
        console.error("Error in updating name: ", error)
    }
})

//router to edit the bio in MyProfile.tsx
router.put("/updatebio", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, UpdateFields>, res: express.Response) => {
    try {
        const { updatedBio } = req.body

        const updateBio = await prisma.profile.update({
            where: { userId: (req.user as User).id },
            data: {
                bio: updatedBio
            }
        })

        if (!updateBio) {
            return res.status(500).json({ message: "updateBio not found" })
        }

        res.json({ message: "Profile bio updated successfully", profile: updateBio })

    } catch (error) {
        console.error("Error in updating bio: ", error)
    }
})

//router to create a profile after signup
router.put("/profile", passport.authenticate('jwt', { session: false }), async (req: express.Request<{}, {}, ProfileFields>, res: express.Response) => {
    try {
        const { name, bio } = req.body;
        console.log(req);
        const updatedProfile = await prisma.profile.update({
            where: { userId: (req.user as User).id },
            data: {
                name,
                bio,
            },
        });

        if (!updatedProfile) {
            return res.status(500).json({ message: "Error updating profile" })
        }

        res.json({ message: "Profile updated successfully", profile: updatedProfile })

    } catch (error) {
        console.error("Error in profile route: ", error)
    }
})

// route to signin
router.post("/signin", async (req: express.Request<{}, {}, UserFields>, res: express.Response) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Missing email" })
    }
    else if (!password) {
        return res.status(400).json({ message: "Missing password" })
    }

    const user = await prisma.user.findUnique({
        where: { email }
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
    console.log("token from signup ", token); // this works

    if (!process.env.JWT_SECRET) {
        return res.json({ message: "Error: JWT_SECRET is empty or not set" })
    }

    res.cookie("jwt", token, { httpOnly: true, secure: false }) //set secure:true for PRODUCTION    
    res.json({ message: 'Login successful', token, user })
})

// route to logout
router.put("/logout", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.cookie("jwt", { path: '/' })
    res.status(200).json({ message: 'user logged out' });
});



router.get("/check", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = (req.user as User).id;
    const payload = { userId: userId }
    // console.log("payload from check route: ", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET ? process.env.JWT_SECRET : "", { expiresIn: "1h" })
    // console.log("token from check route: ", token);

    res.cookie("jwt", token, { httpOnly: true, secure: false }) //set secure:true for PRODUCTION    
    res.status(200).json({ message: 'Authenticated', token, userId });
});

export default router;