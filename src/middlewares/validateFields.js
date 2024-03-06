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



