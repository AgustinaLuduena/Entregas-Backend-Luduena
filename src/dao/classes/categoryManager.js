import CategoryRepository from "../../repositories/categoryRepository.js";
//Logger
import logger from "../../utils/logger-env.js";

export default class CategoryManager {
  constructor() {
    this.categoryRepository = new CategoryRepository();
    logger.info("CategoryManager Constructor");
  }

  async getAll() {
    try {
      return await this.categoryRepository.getAll();
    } catch (error) {
      logger.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      return await this.categoryRepository.getById(id);
    } catch (error) {
      logger.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  async createCategory(category) {
    try {
      return await this.categoryRepository.create(category);
    } catch (error) {
      logger.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id, categoryData) {
    try {
      return await this.categoryRepository.update(id, categoryData);
    } catch (error) {
      logger.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
}
