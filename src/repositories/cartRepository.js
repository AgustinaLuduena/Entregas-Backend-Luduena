import cartModel from "../dao/models/carts.js";

export default class CartRepository {
    async getAll() {
        return await cartModel
            .find()
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    model: 'Products'
                }
            })
            .lean();
    }

    async getById(cid) {
        try {
            const cart = await cartModel.findById(cid)
                .populate({
                    path: 'products',
                    populate: {
                        path: 'product',
                        model: 'Products'
                    }
                })
                .exec();

            if (!cart) {
                throw new Error(`Cart with ID ${cid} not found`);
            }

            return cart;
        } catch (error) {
            throw new Error(`Error retrieving cart: ${error.message}`);
        }
    }


    async create() {
        return await cartModel.create({});
    }

    async update(cid, updateData) {
        const cart = await cartModel.findById(cid);
        if (!cart) return false;

        const productIds = updateData.map(item => item.product);
        // Implementar lógica de validación de productos si es necesario

        updateData.forEach((item) => {
            let existingProductIndex = cart.products.findIndex((product) => product.product.toString() === item.product);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = item.quantity;
            } else {
                cart.products.push({ product: item.product, quantity: item.quantity });
            }
        });

        await cart.save();
        return true;
    }

    async deleteProduct(cid, pid) {
        const cart = await cartModel.findById(cid);
        if (!cart) return false;

        const productIndex = cart.products.findIndex((product) => product.product.toString() === pid);
        if (productIndex === -1) return false;

        cart.products.splice(productIndex, 1);
        await cart.save();
        return true;
    }

    async updateProductQuantity(cid, pid, newQuantity) {
        const cart = await cartModel.findById(cid);
        if (!cart) return false;

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
        if (productIndex === -1) return false;

        cart.products[productIndex].quantity = newQuantity;
        await cart.save();
        return true;
    }

    async deleteAllProducts(cid) {
        const cart = await cartModel.findById(cid);
        if (!cart) return false;

        cart.products = [];
        await cart.save();
        return true;
    }

    async updatePurchasedCart(cid, products, total) {
        return await cartModel.findByIdAndUpdate(
            cid,
            { products: products, total: total },
            { new: true }
        );
    }

    async clearCart(cid) {
        return await cartModel.findByIdAndUpdate(
            cid,
            { products: [], total: 0 },
            { new: true }
        );
    }
}
