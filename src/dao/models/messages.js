import mongoose from "mongoose";
const { Schema } = mongoose

const collection = "Messages"

const msgSchema = new Schema({

        user: {
            type: String
        },
        text: {
            type: String
        }

})

const messagesModel = mongoose.model(collection, msgSchema)

export default messagesModel
