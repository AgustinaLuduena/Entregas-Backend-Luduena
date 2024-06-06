export const validateProduct = (product) => {

    const {title, code, price, stock, category, ...others } = product;

    return `Error when creating the product.
    Expected arguments:
    - title of type String is expected - ${title} was recived.
    - code of type String is expected - ${code} was recived.
    - price of type Number is expected - ${price} was recived.
    - stock of type Number is expected - ${stock} was recived.
    - category of type String is expected - ${category} was recived.
    Optional arguments:
    - description, status, colors, sizes, thumbnails - ${JSON.stringify(others)} were received.`;
}

export const notFound = (id) => {
    return `Error. ID NUMBER ${id} NOT FOUND.`
}

export const userNotFound = () => {
    return `Error. THE USER WAS NOT FOUND.`
}

export const authError = () => {
    return `Error. Authentication Error.`
}

export const authorizationError = () => {
    return `Error. Authorization Error.`
}

export const dataError = () => {
    return `Error getting data.`
}

export const updateError = () => {
    return `Error updating data.`
}

export const loginError = () => {
    return `Error. Please, login to continue.`
}