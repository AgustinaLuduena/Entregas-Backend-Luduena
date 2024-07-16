import UserRepository from '../../repositories/userRepository.js';

const userRepository = new UserRepository();

export default class UserManager {
    async getAllUsers() {
        return await userRepository.getAllUsers();
    }

    async getById(id) {
        return await userRepository.getUserById(id);
    }

    async getByEmail(email) {
        return await userRepository.getUserByEmail(email);
    }

    async createUser(userData) {
        return await userRepository.createUser(userData);
    }

    async updateUser(id, userData) {
        return await userRepository.updateUser(id, userData);
    }

    async deleteUser(id) {
        return await userRepository.deleteUser(id);
    }

    async getAllUsersWithCart() {
        return await userRepository.getAllUsersWithCart();
    }

    async getUserWithCart(userId) {
        return await userRepository.getUserWithCart(userId);
    }

    async checkUserRole(id) {
        return await userRepository.checkUserRole(id);
    }
}
