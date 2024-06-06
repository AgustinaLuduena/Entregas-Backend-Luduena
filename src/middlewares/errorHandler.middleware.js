export const errorHandler = (error, req, res, next) => {
    if(error){
        if(error.code) {
            console.log(`${error.name}: ${error.descrption}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(error.code).json({error: error.message});
        } else {
            console.log(error)
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({error: "Unexpected error"})
        }
    }

    next();
};

