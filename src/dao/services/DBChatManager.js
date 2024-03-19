/* 
import messagesModel from "../models/messages.js"

export default class DBChatManager {

    constructor(){
        console.log("Trabajando con ChatManager")
    }

    getMessages = async () => {
        let result = await messagesModel.find()
        return result
    }
    newMessage = async (msg) => {
        let result = await messagesModel.create(msg)
        return result
    }

}
*/