import config from "../config/config.js";
import connectDb from "../config/database.js";
export let cartManager;
export let productManager;
export let userManager;
export let categoryManager;
export let authManager;
export let mailingService;

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
        const {default : MailingService } = await import (
            "../services/mailing.js"
        );

        cartManager = new CartManager();
        productManager = new DBProductManager();
        userManager = new UserManager();
        categoryManager = new CategoryManager();
        authManager = new AuthManager();
        mailingService = new MailingService();
        break;
 
    case "FS":
        //No implementation
        break;
    default:
        break;
}

