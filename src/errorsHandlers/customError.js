export class CustomError {
    static CustomError(name, message, code, description){
        const error = new Error(message)
        error.name = name;
        error.code = code;
        error.description = description;
        return error;
    }
}