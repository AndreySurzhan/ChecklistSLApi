const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');

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
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            var newUser = new User();

            // set the user's local credentials
            newUser.email = email;
            newUser.password = newUser.generateHash(password);

            // save the user
            newUser.save(function (err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        });
    }
));
