const logging = require('../utils/logging');

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
            logging.error(error);

            return error;
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
            logging.error(error);

            throw error;
        }

        if (!doc) {
            throw new Error(`Document with id "${id}" doesn't exist in "${this.collectionName}" collection`);
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
            data.modifiedBy = userId;

            await this.model.findOneAndUpdate({
                _id: id
            }, data, {
                new: true
            });
            
            doc = await this.findById(id);
        } catch (error) {
            logging.error(`Failed to update document with id "${id}" in "${this.collectionName}" collection`)
            logging.error(error);

            throw error;
        }

        if (!doc) {
            return new Error(`Failed to get updated document with id "${id}" from "${this.collectionName}" collection`)
        }

        logging.info(`Document with id ${id} has been succesfully updated in "${this.collectionName}" collection`);

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
            logging.error(`Failed to delete document by id "${id}" from "${this.collectionName}" collection`)
            logging.error(error);

            throw error;
        }

        if (!doc) {
            throw new Error(`Failed to get deleted document "${id}" from "${this.collectionName}" collection`)
        }

        logging.info(`Document "${id}" has been succesfully deleted from "${this.collectionName}" collection`);

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
            logging.error(`Failed to delete many documents by ids "${ids}"  from "${this.collectionName}" collection`)
            logging.error(error);

            throw error;
        }

        if (!docs) {
            throw new Error(`Failed to get deleted document "${ids}" from "${this.collectionName}" collection`)
        }

        logging.info(`Documents "${ids}" have been succesfully deleted from "${this.collectionName}" collection`);

        return docs;
    }
}