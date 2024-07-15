import userModel from '../dao/models/users.js';
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { dataError, notFound } from "../errorsHandlers/productsError.js";
import { createHash } from "../utils/utils.js";

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

    async checkUserRole(id) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw CustomError.CustomError(
                    "Error", `User with id ${id} not found.`,
                    errorTypes.ERROR_NOT_FOUND,
                    notFound(id)
                );
            }

            if (user.role === "User") {
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
}
