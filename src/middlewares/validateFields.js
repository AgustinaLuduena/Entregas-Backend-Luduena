import { CustomError } from "../errorsHandlers/customError.js";
import { errorTypes } from "../errorsHandlers/errorTypes.js";
import { validateProduct } from "../errorsHandlers/productsError.js";

// Helper function to validate required fields
export const validateProductFields = (fields, data) => {
    for (let field of fields) {
        if (!data[field] || data[field] === "undefined") {
            throw CustomError.CustomError(
                "Missing Data", `Enter the property data for ${field}`,
                errorTypes.ERROR_INVALID_ARGUMENTS,
                validateProduct(data)
            );
        }
    }
};