/// Libs
const mongoose = require('mongoose');
/// Models
const Item = require('./item');
const User = require('./user');
/// Local variables
let Checklist;
let ChecklistSchema;
let Schema = mongoose.Schema;

/**
 * Checklist mongoose schema.
 * @class models/ChecklistSchema
 */
ChecklistSchema = new Schema({
    /**
     * The checklist name.
     *
     * @type String
     * @memberof models/ChecklistSchema
     */
    name: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The list of user links.
     *
     * @type ObjectId[]
     * @memberof models/ChecklistSchema
     */
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    /**
     * The list of item links.
     *
     * @type ObjectId[]
     * @memberof models/ChecklistSchema
     */
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],

    /**
     * Marker that determins that checklist is active.
     *
     * @type boolean
     * @memberof models/ChecklistSchema
     */
    isActive: {
        type: Boolean
    },

    /**
     * The creation date.
     *
     * @type Date
     * @memberof models/ChecklistSchema
     */
    created: {
        type: Date
    },

    /**
     * The date of the last user modification.
     *
     * @type Date
     * @memberof models/ChecklistSchema
     */
    modified: {
        type: Date,
        default: Date.now
    },

    /**
     * @type ObjectId
     * @memberof models/ChecklistSchema
     */
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    /**
     * @type ObjectId
     * @memberof models/ChecklistSchema
     */
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

if (mongoose.models.Checklist) {
    Checklist = mongoose.model('Checklist');
} else {
    Checklist = mongoose.model('Checklist', ChecklistSchema);
}

module.exports = Checklist;