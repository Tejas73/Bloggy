import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import prisma from "./prismaClient";

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies.jwt]),
    secretOrKey: process.env.JWT_SECRET ? process.env.JWT_SECRET : ""
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload: { userId: string }, done: (arg0: null, arg1: any) => any) => {
    const user = await prisma.user.findUnique({
        where: { id: payload.userId }
    });

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});
