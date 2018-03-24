/// Libs
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
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
     * The user password.
     *
     * @type String
     * @memberof models/UserSchema
     */
    password: {
        type: String,
        required: true
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
UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * @function
 * @name validPassword
 * @memberof models/UserSchema
 *
 * @param {string} password
 *
 * @returns {boolean}
 */
UserSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;