import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "./src/uploads/";

        switch (file.fieldname) {
            case "profile":
                folder += "profiles/";
                break;
            case "product":
                folder += "products/";
                break;
            case "id":
                folder += "ids/";
                break;
            case "adress":
                folder += "proofOfAddress/";
                break;
            case "acount":
                folder += "bankStatements/";
                break;
            case "document":
                folder += "documents/";
                break;
            default:
                return cb(new Error("Invalid file fieldname"));
        }

        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const userId = req.user.user._id;
        console.log(req.user.user);
        cb(null, userId + '-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFieldnames = ["profile", "product", "id", "adress", "acount", "document"];
        if (!allowedFieldnames.includes(file.fieldname)) {
            return cb(new Error("Invalid file fieldname"));
        }
        cb(null, true);
    }
});

export { upload };
