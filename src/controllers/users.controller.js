//Factory
import { userManager, cartManager } from "../dao/factory.js";
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { userNotFound } from "../errorsHandlers/productsError.js";
//Logger
import logger from "../utils/logger-env.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userManager.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        logger.error(`Error fetching users: ${error}`);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userManager.getById(id);
        if (!user) {
            throw CustomError.CustomError(
                "Error", `User with id ${id} not found.`,
                errorTypes.ERROR_NOT_FOUND,
                userNotFound()
            );
        } else {
            res.status(200).json({ user });
        }
    } catch (error) {
        logger.error(`Error fetching user: ${error}`);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userManager.getByEmail(email);
        if (!user) {
            throw CustomError.CustomError(
                "Error", `User with id ${id} not found.`,
                errorTypes.ERROR_NOT_FOUND,
                userNotFound()
            );
        } else {
            res.status(200).json({ user });
        }
    } catch (error) {
        logger.error(`Error fetching user: ${error}`);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = req.body;

        if (!newUser.cart) {
            const newCart = await cartManager.createCart();
            newUser.cart = newCart._id;
        }

        newUser.role = "User";

        const createdUser = await userManager.createUser(newUser);

        const populatedUser = await userManager.getUserWithCart(createdUser._id);

        res.status(201).json({ user: populatedUser });
        logger.info("User created successfully")
    } catch (error) {
        logger.error(`Error creating user: ${error}`);
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;
        const result = await userManager.updateUser(id, updatedUser);
        if (result) {
            res.status(200).json({ message: "User updated successfully" });
            logger.info("User updated successfully")
        } else {
            throw CustomError.CustomError(
                "Error", `User with id ${id} not found.`,
                errorTypes.ERROR_NOT_FOUND,
                userNotFound()
            );
        }
    } catch (error) {
        logger.error(`Error updating user: ${error}`);
        res.status(500).json({ error: 'Error updating user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userManager.deleteUser(id);
        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully" });
            logger.info("User deleted successfully")
        } else {
            throw CustomError.CustomError(
                "Error", `User with id ${id} not found.`,
                errorTypes.ERROR_NOT_FOUND,
                userNotFound()
            );
        }
    } catch (error) {
        logger.error(`Error deleting user: ${error}`);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userManager.checkUserRole(id);
        if (result) {
            const userRole = result.role;
            res.status(200).json({ message: `User role updated to ${userRole}` });
            logger.info(`User role updated to ${userRole}`);
        } else {
            throw CustomError.CustomError(
                "Error", `User with id ${id} not found.`,
                errorTypes.ERROR_NOT_FOUND,
                userNotFound()
            );
        }
    } catch (error) {
        logger.error(`Error changing user role: ${error}`);
        res.status(500).json({ error: 'Error changing user role' });
    }
};
