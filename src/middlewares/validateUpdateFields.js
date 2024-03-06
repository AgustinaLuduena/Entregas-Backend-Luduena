
const validateUpdateFields = function validateProductFields(req, res, next) {
    const { title, description, category, price, stock } = req.body;
    const fieldsToUpdate = { title, description, category, price, stock };

    for (const field in fieldsToUpdate) {
        if (fieldsToUpdate[field] !== undefined) {
            if (field === 'title' && typeof fieldsToUpdate[field] !== 'string') {
                return res.status(400).send({ error: 'Title must be a string.' });
            }
            if (field === 'description' && typeof fieldsToUpdate[field] !== 'string') {
                return res.status(400).send({ error: 'Description must be a string.' });
            }
            if (field === 'category' && typeof fieldsToUpdate[field] !== 'string') {
                return res.status(400).send({ error: 'Category must be a string.' });
            }
            if (field === 'price' && typeof fieldsToUpdate[field] !== 'number') {
                return res.status(400).send({ error: 'Price must be a number.' });
            }
            if (field === 'stock' && typeof fieldsToUpdate[field] !== 'number') {
                return res.status(400).send({ error: 'Stock must be a number.' });
            }
        }
    }
    
    next();
}

export default validateUpdateFields;
