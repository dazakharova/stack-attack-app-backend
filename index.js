require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const containersRouter = require('./routes/containers')
const itemsRouter = require('./routes/items')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')


const app = express()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());

app.use('/containers', containersRouter)
app.use('/items', itemsRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)

const PORT = process.env.PORT


app.listen(PORT)
