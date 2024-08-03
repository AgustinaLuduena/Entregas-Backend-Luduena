//Factory
import { categoryManager } from "../dao/factory.js";
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { notFound } from "../errorsHandlers/productsError.js";


export const getAll = async (req, res) => {
    try {
        const categories = await categoryManager.getAll();
        res.json(categories);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const getById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryManager.getById(categoryId);
        if (!category) {
          throw CustomError.CustomError(
            "Error", `The Category Id ${categoryId} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            notFound(categoryId))
        }
        res.json(category);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const createCategory = async (req, res) => {
    try {
        const newCategory = await categoryManager.createCategory(req.body);
        res.status(201).json(newCategory);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategory = await categoryManager.updateCategory(
          categoryId,
          req.body
        );
        res.status(200).json({ message: "Category updated successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const result = await categoryManager.deleteCategory(categoryId);
        if (result.deletedCount === 0) {
          throw CustomError.CustomError(
            "Error", `The Category Id ${categoryId} was not found.`,
            errorTypes.ERROR_NOT_FOUND, 
            notFound(categoryId))
        }
        res.json({ message: "Category deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}