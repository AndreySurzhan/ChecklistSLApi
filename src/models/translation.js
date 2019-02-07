/// Libs
const mongoose = require('mongoose');
/// Models
const Item = require('./item');
const User = require('./user');
/// Local variables
let Schema = mongoose.Schema;
let Translation;
let TranslationSchema;

/**
 *  @swagger
 * 
 *  components:
 *    schemas:
 *      Translation:      
 *        allOf:
 *          - $ref: '#/components/schemas/MongoId'
 *          - type: object
 *            properties:
 *              language:
 *                type: string
 *              translation:
 *                type: string
 *              created:
 *                type: string
 *                format: date-time
 *              createdBy:
 *                type: string
 *            required:
 *              - language
 *              - translation
*/

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
     * The creation date.
     *
     * @type Date
     * @memberof models/TranslationSchema
     */
    created: {
        type: Date
    },

    /**
     * @type ObjectId
     * @memberof models/TranslationSchema
     */
    createdBy: {
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