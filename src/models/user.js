/// Libs
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const logging = require('../utils/logging');
/// Models
const Checklist = require('./checklist');
/// Local variables
let User;
let UserSchema;
let Schema = mongoose.Schema;

/**
 *  @swagger
 * 
 *  components:
 *    schemas:
 *      AuditDate:
 *        type: object
 *        properties:
 *          created:
 *            type: string
 *            format: date-time
 *          modified:
 *            type: string
 *            format: date-time
 *      Audit:
 *        allOf:
 *          - type: object
 *            properties:
 *              createdBy:
 *                type: string
 *              modifiedBy:
 *                type: string
 *      MongoId:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            uniqueItems: true
 *      NewUser:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *            uniqueItems: true
 *          password:
 *            type: string
 *          languages:
 *            type: array
 *            items:
 *              type: string
 *      User:      
 *        allOf:
 *          - $ref: '#/components/schemas/MongoId'
 *          - $ref: '#/components/schemas/NewUser'
 *          - type: object
 *            properties:
 *              checklists:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/MongoId'
 *              token:
 *                type: string
 *          - $ref: '#/components/schemas/AuditDate'
 *            required:
 *              - username
 *              - password
 *              - languages
*/

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
 * @name token
 * @type String
 * @memberof models/UserSchema
 * @virtual
 */
UserSchema.virtual('token')
    .get(function() {
        return this.generateJWT();
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

/**
 * @function
 * @name generateJWT
 * @memberof models/UserSchema
 *
 * @returns {string}
 */
UserSchema.methods.generateJWT = function() {
    let that = this;

    return jwt.sign({
      username: that.username,
      id: that._id,
    }, process.env.CLIENT_WEB_API_SECRET, {
        expiresIn: process.env.PASSWORD_RECOVERY_TOKEN_LIFE
    });
}

UserSchema.set('toObject', { virtuals: true });

if (mongoose.models.User) {
    User = mongoose.model('User');
} else {
    User = mongoose.model('User', UserSchema);
}

module.exports = User;