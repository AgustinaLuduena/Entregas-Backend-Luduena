import AuthRepository from "../../repositories/authRepository.js";
//Logger
import logger from "../../utils/logger-env.js";

const authRepository = new AuthRepository();

export default class AuthManager {
  constructor() {
    logger.info("Constructor AuthManager");
  }

  async login(credentials) {
    try {
      const { email, password } = credentials;
      const result = await authRepository.login(email, password);
      return result;
    } catch (error) {
      logger.error(`Error during login: ${error.message}`);
      throw error;
    }
  }

  async adminLogin(credentials) {
    try {
      const { email, password } = credentials;
      const result = await authRepository.adminLogin(email, password);
      return result;
    } catch (error) {
      logger.error(`Error during admin login: ${error.message}`);
      throw error;
    }
  }

  async clearCookie(res, cookie) {
    try {
      await authRepository.clearCookie(res, cookie);
    } catch (error) {
      logger.error(`Error clearing cookie: ${error.message}`);
      throw error;
    }
  }
}
