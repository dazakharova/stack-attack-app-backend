const userRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');
const bcrypt = require("bcrypt");

// Get a profile picture
userRouter.get('/getPicture', authenticateToken, async(request, response) => {
    try {
        const result = await query('SELECT profile_pic FROM users WHERE id = $1', [request.userID]);
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

// Update a profile picture
userRouter.put('/updatePicture', authenticateToken, async(request, response) => {
    const { image } = request.body

    try {
        const result = await query('UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *', [image, request.userID]);

        // Exclude password from the response
        delete result.rows[0].password;
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

userRouter.put('/changePassword', authenticateToken, async(request, response) => {
    const { currentPassword, newPassword } = request.body

    try {
        // Get stored hashed password of the current user
        const user = await query('SELECT * FROM users WHERE id = $1', [request.userID])
        const storedPassword = user.rows[0].password

        // Compare provided password with stored hash
        const isValid = await bcrypt.compare(currentPassword, storedPassword)
        if (!isValid) {
            return response.status(401).send({ message: 'Invalid password.' })
        }

        // Hash password
        const saltRounds = 10; // Cost factor for hashing
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // If current password matches the stored one, save new password to the database
        const result = await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, request.userID])

        // Respond with no content, just indicating the operation was successful
        response.status(204).send()
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

module.exports = userRouter