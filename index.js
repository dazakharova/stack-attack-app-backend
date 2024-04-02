const express = require('express')
const containersRouter = require('./routes/containers')
const itemsRouter = require('./routes/items')


const app = express()

app.use('/containers', containersRouter)
app.use('/items', itemsRouter)

const PORT = 3001


app.listen(PORT)
