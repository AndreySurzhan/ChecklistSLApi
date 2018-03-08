/// Libs
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
/// Models
const Checklist = require('./checklist');
const Setting = require('./setting');
/// Local variables
let Schema = mongoose.Schema;
let User;
let UserSchema;

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
        unique: true,
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
     * The setting link.
     *
     * @type ObjectId
     * @memberof models/UserSchema
     */
    settings: {
        type: Schema.Types.ObjectId,
        ref: 'Settings',
        default: null
    },

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
