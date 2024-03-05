/*const validateFields = function validateProductFields(req, res, next) {
    const { method, body } = req;
    const { title, description, category, price, stock } = body;

    if (method === 'POST' && (!title || !description || !category || !price || !stock)) {
        // Verificar que todos los campos requeridos estén presentes para la solicitud POST
        return res.status(400).send({ error: 'All fields are required for adding a new product.' });
    }

    // Verificar el tipo de dato de los campos
    if (typeof title !== 'string' || typeof description !== 'string' || typeof category !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
        return res.status(400).send({ error: 'Fields are not of the required type.' });
    }

    next();
}

export default validateFields;

*/



const validateFields = function validateProductFields(req, res, next) {
    const { title, description, category, price, stock } = req.body;
    
    if (!title || !description || !price || !stock || !category) {
        return res.status(400).send({ error: `Please, complete all the information of the new product.` });
    } else if (typeof title !== 'string' || typeof description !== 'string' || typeof category !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
        return res.status(400).send({ error: 'Fields are not of the required type.' });
    }

    next();
}

export default validateFields;



//|| !code 



/*
const validateFields = function validateProductFields(req, res, next) {
    const { title, description, category, price, stock } = req.body;
    
    if (typeof title !== 'string' || typeof description !== 'string' || typeof category !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
        return res.status(400).send({ error: 'Fields are not of the required type.' });
    }
    
    next();
}

export default validateFields

*/

