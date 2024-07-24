//Factory
import { userManager, cartManager } from "../dao/factory.js";
//Mail Controller
import { deletedAcountNotification } from "./mail.controller.js";
//Multer Middleware
import multer from "multer";
import { upload } from "../middlewares/multerMiddleware.js";
//ErrorHandler
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { dataError, userNotFound } from "../errorsHandlers/productsError.js";
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
        const { first_name, last_name, email, password, age } = req.body;

        if (!first_name || !last_name || !email || !password || !age) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newUser = { first_name, last_name, email, password, age }
        
        //Check for existing user
        const checkUser = await userManager.getByEmail(newUser.email);
        if (checkUser) {
            logger.warning(`Error creating the user. User email ${newUser.email} already exist in the database.`);
            return res.status(400).json({ error: `User email ${newUser.email} already exist in the database.` });
        }

        //Age control
        if(isNaN(newUser.age)){return res.status(400).json({ error: 'Age must be a number.' });}
        if(newUser.age < 18){
            logger.warning(`Error. User must be olther tah 18 years old, not ${newUser.age}`);
            return res.status(400).json({ error: 'You must be olther tah 18 years old.' });
        }

        //Add a cart to the user
        if (!newUser.cart) {
            const newCart = await cartManager.createCart();
            newUser.cart = newCart._id;
        }

        //Add the user role
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

export const deleteInactiveUsers = async (req, res) => {
    try {
        const inactiveLimitdate = new Date();
        const limitTime = 1
        //inactiveLimitdate.setDate(inactiveLimitdate.getDate() - 2);
        inactiveLimitdate.setMinutes(inactiveLimitdate.getMinutes() - limitTime);

        const inactiveUsers = await userManager.getInactiveUsers(inactiveLimitdate)

        if (!inactiveUsers){
            throw CustomError.CustomError(
                "Error", `Error getting inactive users data.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }

        if (inactiveUsers.length === 0) {
            return res.status(200).json({ message: 'No inactive users found', deletedCount: 0 });
        }

        const deletedResult = await userManager.deleteInactiveUsers(inactiveUsers)
        
        if (deletedResult.deletedCount > 0) {
            for (let user of inactiveUsers) {
                await deletedAcountNotification( user.email, inactiveLimitdate );
            }
        
            res.status(200).json({ message: 'Inactive users deleted', deletedCount: deletedResult, deletedUsers: inactiveUsers  });
            logger.info('Inactive users deleted')
        }

    } catch (error) {
        logger.error(`Error deleting inactive users: ${error.message}`);
        res.status(500).json({ error: 'Error deleting inactive users' });
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

export const uploadDocuments = (req, res, next) => {
    upload.fields([
        { name: 'profile', maxCount: 1 },
        { name: 'product', maxCount: 1 },
        { name: 'document', maxCount: 5 }
    ])(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            const { uid } = req.params;
            const files = req.files;

            const documents = [];
            for (const key in files) {
                files[key].forEach(file => {
                    documents.push({
                        name: file.originalname,
                        reference: file.path
                    });
                });
            }

            await updateUserStatus(uid, { documentsUploaded: true, documents });

            res.status(200).json({ message: "Files uploaded and user status updated successfully" });
        } catch (error) {
            next(error);
        }
    });
};

const updateUserStatus = async (userId, updateData) => {
    try {
        const updatedUser = await userManager.updateUserDocs(userId, updateData);
        if (updatedUser) {
            logger.info(`User status updated successfully for user ID: ${userId}`);
        } else {
            throw new Error(`User with ID ${userId} not found`);
        }
    } catch (error) {
        logger.error(`Error updating user status: ${error}`);
        throw error;
    }
};