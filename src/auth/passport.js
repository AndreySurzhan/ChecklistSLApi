const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        UserModel.findOne({
            username: username
        }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message: `Cannot find user with username "${username}"`
                });
            }

            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is incorrect'
                });
            }

            return done(null, user);
        });
    }
));

let pass = passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.CLIENT_WEB_API_SECRET
    },
    (jwtPayload, done) => {
        return UserModel.findById(jwtPayload.id)
            .then(user => {
                if (!user) {
                    return done(null, false, {
                        message: `Cannot find user with id "${jwtPayload.id}"`
                    });
                }

                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }));

module.exports = pass;