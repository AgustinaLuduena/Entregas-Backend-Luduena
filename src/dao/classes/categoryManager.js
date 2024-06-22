import Category from "../models/category.js"
//Logger
import logger from "../../utils/logger-env.js"; 

export default class CategoryManager {
  constructor() {
    logger.info("CategoryManager Constructor")
  }

  getAll = async () => {
    const result = await Category.find();
    return result;
  };

  getById = async (id) => {
    const result = await Category.findById(id);
    return result;
  };

  createCategory = async (category) => {
    const result = await Category.create(category);
    return result;
  };

  updateCategory = async (id, categoryData) => {
    const result = await Category.updateOne(
      { _id: id },
      { $set: categoryData }
    );
    return result;
  };

  deleteCategory = async (id) => {
    const result = await Category.deleteOne({ _id: id });
    return result;
  };
}