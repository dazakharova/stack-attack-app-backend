const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const authRouter = require('express').Router()
const { query } = require('../db/index.js')
const { authenticateToken } = require('../middleware/authentication')


// Checking authentication status
authRouter.get('/status', (req, res) => {
    // const token = req.cookies['token'];

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('got token!!!', token)
    if (!token) {
        return res.json({ isAuthenticated: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.json({ isAuthenticated: false });
        }
        res.json({ isAuthenticated: true, userId: user.userId });
    })
})

// The /register endpoint handler
authRouter.post('/register', async(request, response) => {
    const { name, email, password } = request.body

    try {
        // Check if the user already exists
        const userExists = await query('SELECT * FROM users WHERE email = $1',
            [email])
        if (userExists.rows.length) {
            return response.status(400).send({ message: 'Username already exists' })
        }

        // Hash password
        const saltRounds = 10; // Cost factor for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const newUser = await query('INSERT INTO users (name, email, password) values ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        // Respond with the created user (excluding password)
        delete newUser.rows[0].password;
        response.status(201).send(newUser.rows[0]);
    } catch (error) {
        console.error('Error registering new user:', error);
        response.status(500).send({ error: error, message: 'Internal server error' });
    }
})

// The /login endpoint handler
authRouter.post('/login', async(request, response) => {
    const { email, password } = request.body

    try {
        // Check if the user exists
        const result = await query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            return response.status(401).send({ message: 'Invalid username' })
        }

        const user = result.rows[0]

        // Compare provided password with stored hash
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return response.status(401).send({ message: 'Invalid password' })
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        response.status(200).send({ message: 'Login successful', token: token });
    } catch (error) {
        console.error('Login error:', error)
        response.status(500).send({ error: error, message: 'Internal server error' })
    }
})

authRouter.post('/logout', (request, response) => {
    response.status(200).send({ message: 'Logged out successfully', token: '' });
})

authRouter.get('/profile', authenticateToken, async (request, response) => {
    const userId = request.user.userId;

    try {
        // Fetch containers owned by the user
        const containersResult = await query('SELECT * FROM containers WHERE user_id = $1', [userId]);

        // For each container, fetch items
        const containersWithItems = await Promise.all(containersResult.rows.map(async (container) => {
            const itemsResult = await query('SELECT * FROM items WHERE container_id = $1', [container.id]);
            // Add the items to the container object under the 'items' key
            return { ...container, items: itemsResult.rows };
        }));

        response.status(200).json({ containers: containersWithItems });
    } catch (error) {
        console.error('Profile data fetch error:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = authRouter