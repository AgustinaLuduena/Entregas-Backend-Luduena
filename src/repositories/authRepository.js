import userModel from "../dao/models/users.js";
import { isValidPassword, generateToken } from "../utils/utils.js";
import { CustomError } from '../errorsHandlers/customError.js';
import { errorTypes } from '../errorsHandlers/errorTypes.js';
import { userNotFound, authError } from "../errorsHandlers/productsError.js";
import logger from "../utils/logger-env.js";

export default class AuthRepository {
  constructor() {
    logger.info("Constructor AuthRepository");
  }

  async findByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      throw CustomError.CustomError(
        "Error", `Error finding user by email: ${email}`,
        errorTypes.ERROR_DATA,
        error.message
      );
    }
  }

  async login(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw CustomError.CustomError(
          "Error", `User not found.`,
          errorTypes.ERROR_NOT_FOUND,
          userNotFound()
        );
      }
      const valid = isValidPassword(user, password);
      if (!valid) {
        throw CustomError.CustomError(
          "Error", `Authentication Error.`,
          errorTypes.ERROR_AUTHENTICATION,
          authError()
        );
      }
      const token = generateToken(user);
      logger.info(token);
      return { message: "Authentication successful", token };

    } catch (error) {
      logger.error(error);
      throw CustomError.CustomError(
        "Error", `Error during login process.`,
        errorTypes.ERROR_DATA,
        error.message
      );
    }
  }

  async adminLogin(email, password) {
    try {
      // Simulated admin credentials
      const admin = {
        email: email,
        password: password,
        first_name: "Administrator",
        last_name: "Coderhouse",
        role: "admin",
        age: "Not available",
        cart: "Admin does not have an assigned cart"
      };

      // Generate token for admin
      const token = generateToken(admin);
      return { message: "Admin authentication successful", token };

    } catch (error) {
      logger.error(error);
      throw CustomError.CustomError(
        "Error", `Error during admin login process.`,
        errorTypes.ERROR_DATA,
        error.message
      );
    }
  }

  async clearCookie(res, cookie) {
    try {
      res.clearCookie(cookie, { path: '/' });
    } catch (error) {
      throw CustomError.CustomError(
        "Error", `Error clearing cookie: ${cookie}`,
        errorTypes.ERROR_DATA,
        error.message
      );
    }
  }
}
