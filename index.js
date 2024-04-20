const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const containersRouter = require('./routes/containers')
const itemsRouter = require('./routes/items')
const authRouter = require('./routes/auth')


const app = express()

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Adjust this to your client's origin
    credentials: true,
}));
app.use(cookieParser());

// Middleware to set cache-control headers
app.use((req, res, next) => {
    // Set Cache-Control for all responses
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
})

app.use('/containers', containersRouter)
app.use('/items', itemsRouter)
app.use('/auth', authRouter)

const PORT = 3001


app.listen(PORT)
