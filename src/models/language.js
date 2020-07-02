/// Libs
const mongoose = require('mongoose');
/// Models
const User = require('./user');
/// Local variables
const Schema = mongoose.Schema;

let Language;

/**
 *  @swagger
 * 
 *  components:
 *    schemas:
 *      Language:      
 *        allOf:
 *          - $ref: '#/components/schemas/MongoId'
 *          - type: object
 *            properties:
 *              code:
 *                type: string
 *              name:
 *                type: string
 *          - $ref: '#/components/schemas/Audit'
 *            required:
 *              - name
 *              - code
*/

/**
 * Language mongoose schema.
 * @class models/LanguageSchema
 */
const LanguageSchema = new Schema({
    /**
     * The item text.
     *
     * @type String
     * @memberof models/LanguageSchema
     */
    code: {
        type: String,
        required: true
    },    
    
    /**
    * The item text.
    *
    * @type String
    * @memberof models/LanguageSchema
    */
   name: {
       type: String,
       required: true
   },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/LanguageSchema
     */
    created: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/LanguageSchema
     */
    modified: {
        type: Date,
        default: Date.now
    },

    /**
     * @type ObjectId
     * @memberof models/LanguageSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * @type ObjectId
     * @memberof models/LanguageSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

if (mongoose.models.Language) {
    Language = mongoose.model('Language');
} else {
    Language = mongoose.model('Language', LanguageSchema);
}

module.exports = Language;
