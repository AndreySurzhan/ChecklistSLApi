/// Libs
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const logging = require('../utils/logging');
/// Models
const Checklist = require('./checklist');
/// Local variables
let User;
let UserSchema;
let Schema = mongoose.Schema;

/**
 * User mongoose schema.
 * @class models/UserSchema
 */
UserSchema = new Schema({
    /**
     * The user name.
     *
     * @type String
     * @memberof models/UserSchema
     */
    username: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The hashed password.
     *
     * @type String
     * @memberof models/UserSchema
     */
    hashedPassword: {
        type: String,
        required: true,
        hideField: true
    },

    /**
     * The list of checklist links.
     *
     * @type ObjectId[]
     * @memberof models/UserSchema
     */
    checklists: [{
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    }],

    /**
     * The languages to use for translation.
     *
     * @type String[]
     * @memberof models/UserSchema
     */
    languages: [{
        type: String
    }],

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/UserSchema
     */
    created: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/UserSchema
     */
    modified: {
        type: Date,
        default: Date.now
    }
});

/**
 * @function
 * @name generateHash
 * @memberof models/UserSchema
 *
 * @param {string} password
 *
 * @returns {string} hassedPass
 */
UserSchema.methods.generateHash = function(password) {
    let hashedPassword;

    try {
        hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    } catch (error) {
        logging.error('Failed to hash password');
        logging.error(error);
        hashedPassword = null;
    }
    return hashedPassword;
};

/**
 * @name password
 * @type String
 * @memberof models/UserSchema
 * @virtual
 */
UserSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.hashedPassword = this.generateHash(password);
    })
    .get(function() {
        return this._plainPassword;
    });

/**
 * @function
 * @name validPassword
 * @memberof models/UserSchema
 *
 * @param {string} password
 *
 * @returns {boolean}
 */
UserSchema.methods.validPassword = function(password) {
    let isValid;

    try {
        isValid = bcrypt.compareSync(password, this.hashedPassword);
    } catch (error) {
        logging.error('Failed to validate password');
        logging.error(error);
        isValid = false;
    }
    return isValid;
};

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;