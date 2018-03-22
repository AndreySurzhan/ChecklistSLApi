/// Libs
const mongoose = require('mongoose');
/// Models
const Checklist = require('./checklist');
const User = require('./user');
/// Local variables
let Schema = mongoose.Schema;
let Translation;
let TranslationSchema;

/**
 * Translation mongoose schema.
 * @class models/TranslationSchema
 */
TranslationSchema = new Schema({
    /**
     * The Translation language.
     *
     * @type String
     * @memberof models/TranslationSchema
     */
    language: {
        type: String,
        required: true
    },

    /**
     * The Translation itself.
     *
     * @type String
     * @memberof models/TranslationSchema
     */
    translation: {
        type: String,
        required: true
    },

    /**
     * @type ObjectId
     * @memberof models/TranslationSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/TranslationSchema
     */
    created: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/TranslationSchema
     */
    modified: {
        type: Date,
        default: Date.now
    },

    /**
     * @type ObjectId
     * @memberof models/TranslationSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * @type ObjectId
     * @memberof models/TranslationSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

if (mongoose.models.Translation) {
    Translation = mongoose.model('Translation');
} else {
    Translation = mongoose.model('Translation', TranslationSchema);
}

module.exports = Translation;