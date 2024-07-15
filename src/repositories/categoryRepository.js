import Category from "../dao/models/category.js";
import logger from "../utils/logger-env.js";

export default class CategoryRepository {
  constructor() {
    logger.info("CategoryRepository Constructor");
  }

  async getAll() {
    const result = await Category.find();
    return result;
  }

  async getById(id) {
    const result = await Category.findById(id);
    return result;
  }

  async create(category) {
    const result = await Category.create(category);
    return result;
  }

  async update(id, categoryData) {
    const result = await Category.updateOne({ _id: id }, { $set: categoryData });
    return result;
  }

  async delete(id) {
    const result = await Category.deleteOne({ _id: id });
    return result;
  }
}
