import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import prisma from "./prismaClient";

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies.jwt]),

secretOrKey: process.env.JWT_SECRET ? process.env.JWT_SECRET : "rKnZc2dIyG3YBZyQSe9pBEGLq8jzH8mM"
};

//callback function
export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload: { userId: string }, done: (arg0: null, arg1: any) => any) => {
    // console.log("payload: ", payload)
    const user = await prisma.user.findUnique({
        where: { id: payload.userId }
    });
    
    if (user) {
        // console.log("from auth.ts: ",user);
        return done(null, user);
    } else {
        // console.log("from auth.ts: ",user);
        return done(null, false);
    }
});
