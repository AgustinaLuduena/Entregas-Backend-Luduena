import userModel from '../dao/models/users.js';
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { dataError, notFound } from "../errorsHandlers/productsError.js";
import { createHash } from "../utils/utils.js";
import logger from '../utils/logger-env.js';

export default class UserRepository {
    async getAllUsers() {
        try {
            const users = await userModel.find();
            return users;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error getting the users data.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async getUserById(id) {
        try {
            const user = await userModel.findById(id);
            return user;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error finding user with id ${id}.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound(id)
            );
        }
    }

    async getUserByEmail(email) {
        try {
            const result = await userModel.findOne({ email: email });
            return result;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error deleting user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async createUser(userData) {
        try {
            userData.password = createHash(userData.password);
            const result = await userModel.create(userData);
            return result;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error creating the user.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async updateUser(id, userData) {
        try {
            if (userData.password) {
                userData.password = createHash(userData.password);
            }
            const updateResult = await userModel.updateOne({ _id: id }, { $set: userData });
            return updateResult;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error updating user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async deleteUser(id) {
        try {
            const result = await userModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error deleting user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async getInactiveUsers(inactiveLimitdate) {
        try {
            const inactiveUsers = await userModel.find({
                lastConnection: { $lt: inactiveLimitdate }
            });
            return inactiveUsers;

        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error finding inactive users in the database.`,
                errorTypes.ERROR_NOT_FOUND,
                notFound()
            );
        }
    }

    async deleteInactiveUsers (inactiveUsers) {
        try {    
            let result = await userModel.deleteMany({
                _id: { $in: inactiveUsers.map(user => user._id) }
            });
            return result;

        } catch (error) {
            //throw new Error(`Error deleting inactive users: ${error.message}`);
            throw CustomError.CustomError(
                "Error", `Error deleting user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    };
    
    async getAllUsersWithCart() {
        try {
            const users = await userModel.find().populate("cart");
            return users;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error getting the users data with cart details.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async getUserWithCart(userId) {
        try {
            const user = await userModel.findById(userId).populate('cart');
            return user;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error getting the user data with cart details for user id ${userId}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async changeUserRole(id) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw CustomError.CustomError(
                    "Error", `User with id ${id} not found.`,
                    errorTypes.ERROR_NOT_FOUND,
                    notFound(id)
                );
            }

            const requiredDocuments = ["id", "adress", "acount"];
            const userDocuments = user.documents.map(doc => doc.fieldname);
            const hasAllRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
            
            if (hasAllRequiredDocuments) {
                user.documentsUploaded = true;
            }

            if (user.role === "User" && hasAllRequiredDocuments) {
                user.role = "Premium";
            } else if (user.role === "Premium") {
                user.role = "User";
            } else {
                return false;
            }
            
            await user.save();
            return user;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error updating user role for user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }

    async updateUserDocs(id, updateData) {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                { 
                    $set: { documentsUploaded: updateData.documentsUploaded }, 
                    $push: { documents: { $each: updateData.documents } } 
                },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            throw CustomError.CustomError(
                "Error", `Error updating documents for user with id ${id}.`,
                errorTypes.ERROR_DATA,
                dataError()
            );
        }
    }
}
