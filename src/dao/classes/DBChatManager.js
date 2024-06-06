import messagesModel from "../models/messages.js"

const DBChatManager = {
    getMessages: async (req, res) => {
        try {
            const messages = await messagesModel.find().populate()

            if (req.accepts('html')) {
                return res.render('chat', { messages });
            }
            res.json(messages);
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }

        //Revisar. Al actualizar la vista /api/messages/
    },

    addMessage: async (req, res) => {
        const { user, text } = req.body;

        try {
            const newMessage = new messagesModel({
                user,
                text,
            });

            await newMessage.save();

            return res.json({
                message: 'Mensaje agregado',
                messagesModel: newMessage,
            });
        } catch (err) {
            console.error('Error al guardar el mensaje:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
        }
    },
}

export default DBChatManager;