import config from "../config/config.js";
import connectDb from "../config/database.js";
export let cartManager;
export let productManager;
export let userManager;
export let categoryManager;
export let authManager;

switch (config.persistence) {
    case "MONGODB" :
        const connection = await connectDb()
        const {default : CartManager } = await import (
            "./classes/DBCartManager.js"
        );
        const {default : DBProductManager } = await import (
            "./classes/DBProductManager.js"
        );
        const {default : UserManager } = await import (
            "./classes/usersManager.js"
        );
        const {default : CategoryManager } = await import (
            "./classes/categoryManager.js"
        );
        const {default : AuthManager } = await import (
            "./classes/authManager.js"
        );

        cartManager = new CartManager();
        productManager = new DBProductManager();
        userManager = new UserManager();
        categoryManager = new CategoryManager();
        authManager = new AuthManager();
        break;
 
    case "FS":
        //No implementation
        break;
    default:
        break;
}

