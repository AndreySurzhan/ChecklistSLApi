/// Libs
const mongoose = require('mongoose');
/// Models
const Checklist = require('./checklist');
const Translation = require('./translation');
const User = require('./user');
/// Local variables
let Item;
let ItemSchema;
let Schema = mongoose.Schema;

/**
 * Item mongoose schema.
 * @class models/ItemSchema
 */
ItemSchema = new Schema({
    /**
     * The item text.
     *
     * @type String
     * @memberof models/ItemSchema
     */
    text: {
        type: String,
        required: true
    },

    /**
     * @type ObjectId
     * @memberof models/ItemSchema
     */
    checklist: {
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    },

    /**
     * The list of translation links.
     *
     * @type TranslationSchema[]
     * @memberof models/ItemSchema
     */
    translations: [
        Translation.schema
    ],

    /**
     * Marker that determins that item is checked.
     *
     * @type boolean
     * @memberof models/ItemSchema
     */
    isChecked: {
        type: Boolean
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/ItemSchema
     */
    created: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/ItemSchema
     */
    modified: {
        type: Date,
        default: Date.now
    },

    /**
     * @type ObjectId
     * @memberof models/ItemSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * @type ObjectId
     * @memberof models/ItemSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

if (mongoose.models.Item) {
    Item = mongoose.model('Item');
} else {
    Item = mongoose.model('Item', ItemSchema);
}

module.exports = Item;