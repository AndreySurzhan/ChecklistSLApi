let hideDocumentFields = (schema) => {

    /**
     * Transforms of the resulting object
     *
     * @param {Object} doc - The mongoose document which is being converted
     * @param {Object} ret - The plain object representation which has been converted
     * @param {Object} options - The options in use (either schema options or the options passed inline)
     *
     * @returns ret
     */
    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            Object.keys(schema.obj).forEach((key) => {
                if (schema.obj[key].hideField) {
                    delete ret[key]
                }
            });

            return ret;
        }
    });
};

module.exports = hideDocumentFields;