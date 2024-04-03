const express = require('express')
const cors = require('cors')
const containersRouter = require('./routes/containers')
const itemsRouter = require('./routes/items')
const authRouter = require('./routes/auth')


const app = express()

app.use(express.json())
app.use(cors())
app.use('/containers', containersRouter)
app.use('/items', itemsRouter)
app.use('/auth', authRouter)

const PORT = 3001


app.listen(PORT)
