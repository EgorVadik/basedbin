require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: [process.env.BASE_CLIENT_URL, process.env.ALT_CLIENT_URL],
    },
})
const cors = require('cors')
const mongoose = require('mongoose')
const File = require('./models/file')

app.use(
    cors({
        origin: [process.env.BASE_CLIENT_URL, process.env.ALT_CLIENT_URL],
    })
)

app.use(require('express').json())

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB'))
    .catch((e) => console.log(e))

io.on('connection', (socket) => {
    console.log(`Client connected with ${socket.id}`)
    socket.on('content-change', (data, id) => {
        socket.to(id).emit('update-content', data)
    })

    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        console.log(`${socket.id} joined ${roomId}`)
    })
})

app.post('/api/create-new-file', async (_, res) => {
    try {
        const newFile = await File.create({
            name: 'Untitled',
            content: '',
            lastModified: Date.now(),
        })
        return res.json({ newFile })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

app.get('/api/get-file', async (req, res) => {
    const { id } = req.query
    try {
        const file = await File.findById(id)
        return res.json({ file })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

app.post('/api/save-file', async (req, res) => {
    const { id, content, name } = req.body
    try {
        const file = await File.findById(id)
        file.content = content
        file.name = name
        file.lastModified = Date.now()
        await file.save()
        return res.json({ file })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

server.listen(3000, () => console.log('Listening on port 3000'))
