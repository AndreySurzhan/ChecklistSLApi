const logging = require('../utils/logging');
const NotFoundError = require('../utils/errors').NotFoundError
const mongoose = require('mongoose');
const Validations = require('../utils/validations');

module.exports = class Repository {

    constructor(model, populateString=null) {
        this.model = model;
        this.collectionName = this.model.collection.collectionName;
        this.populateString = populateString;
    }

    /**
     * Method that inserts new doc in database
     * 
     * @async
     * @param {Object} data
     * @returns {Promise <Query>}
     * @memberof Repository
     */
    async insert(data) {
        let doc;

        data.created = new Date();

        try {
            data = new this.model(data);

            await data.save();

            doc = await this.findById(data._id);
        } catch (error) {
            logging.error(data);
            logging.error(`Failed to create new document into "${this.collectionName}"`);

            throw error;
        }

        if (!doc) {
            return new Error(`Failed to get document after it has been saved to "${this.collectionName}" collection`);
        }

        logging.info(`New document "${doc._id}" has been successfully created into "${this.collectionName}" collection`);
        return doc;
    }

    /**
     * Method that gets existing document by id
     * 
     * @async
     * @param {string | ObjectId} id 
     * @returns {Promise <Query>}
     * @memberof Repository
     */
    async findById(id) {
        let doc;

        try {
            if (this.populateString) {
                doc = await this.model.findById(id).populate(this.populateString);
            } else {
                doc = await this.model.findById(id);
            }
        } catch (error) {
            logging.error(`Failed to find document with id "${id}" from "${this.collectionName}" collection`);

            throw error;
        }

        if (!doc) {
            throw new NotFoundError(`Document with id "${id}" doesn't exist in "${this.collectionName}" collection`);
        }

        logging.info(`Document has been successfully found by id "${id}" in "${this.collectionName}" collection`);
        return doc;
    }

    /**
     * Method that updates document data in database
     * 
     * @async
     * @param {string | ObjectId} id 
     * @param {Object} data
     * @param {string | ObjectId} userId
     * @returns {Promise <Query>}
     * @memberof Repository
     */
    async update(id, data, userId) {
        let doc;

        try {        
            if (Validations.isObjectEmpty(data)) {
                const validationError = new mongoose.Error.ValidationError();

                validationError.message = 'Body should not be empty'
        
                throw validationError;
            }

            data.modifiedBy = userId;

            await this.model.findOneAndUpdate({
                _id: id
            }, data, {
                new: true
            });
            
            doc = await this.findById(id);
        } catch (error) {
            logging.error(`Failed to update document with id "${id}" in "${this.collectionName}" collection`);

            throw error;
        }

        if (!doc) {
            return new Error(`Failed to get updated document with id "${id}" from "${this.collectionName}" collection`);
        }

        logging.info(`Document with id ${id} has been successfully updated in "${this.collectionName}" collection`);

        return doc;
    }

    /**
     * Method that deletes existing document by id
     * 
     * @async
     * @param {string | ObjectId} id 
     * @returns {Promise <Query>}
     * @memberof Repository
     */
    async delete(id) {
        let doc = null;

        try {
            doc = await this.model.findOneAndRemove({
                _id: id
            });
        } catch (error) {
            logging.error(`Failed to delete document by id "${id}" from "${this.collectionName}" collection`);

            throw error;
        }

        if (!doc) {
            throw new NotFoundError(`Failed to get deleted document "${id}" from "${this.collectionName}" collection`);
        }

        logging.info(`Document "${id}" has been successfully deleted from "${this.collectionName}" collection`);

        return doc;
    }

    /**
     * Method that gets existing documents by ids
     * 
     * @async
     * @param {string[] | ObjectId[]} ids
     * @returns {Promise <Query>}
     * @memberof Repository
     */
    async deleteManyById(ids) {
        let docs;

        try {
            docs = await this.model.deleteMany({
                _id: {
                    $in: ids
                }
            });
        } catch (error) {
            logging.error(`Failed to delete many documents by ids "${ids}"  from "${this.collectionName}" collection`);

            throw error;
        }

        if (!docs) {
            throw new NotFoundError(`Failed to get deleted document "${ids}" from "${this.collectionName}" collection`);
        }

        logging.info(`Documents "${ids}" have been successfully deleted from "${this.collectionName}" collection`);

        return docs;
    }
}