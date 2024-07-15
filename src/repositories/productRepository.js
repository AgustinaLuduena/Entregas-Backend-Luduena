import productsModel from '../dao/models/products.js';

class ProductRepository {
    async paginate(query, options) {
        return await productsModel.paginate(query, options);
    }

    async populate(docs, options) {
        return await productsModel.populate(docs, options);
    }

    async findById(id) {
        return await productsModel.findById(id);
    }

    async findOne(query) {
        return await productsModel.findOne(query);
    }

    async aggregate(pipeline) {
        return await productsModel.aggregate(pipeline);
    }

    async create(productData) {
        return await productsModel.create(productData);
    }

    async updateOne(query, updateData) {
        return await productsModel.updateOne(query, updateData);
    }

    async deleteOne(query) {
        return await productsModel.deleteOne(query);
    }

    async find(query = {}) {
        return await productsModel.find(query).populate("category");
    }
}

export default new ProductRepository();
