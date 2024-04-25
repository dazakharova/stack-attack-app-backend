const userRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');

// Get a profile picture
userRouter.get('/getPicture', authenticateToken, async(request, response) => {
    try {
        const result = await query('GET profile_pic WHERE id = $1', [request.userID]);
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
        response.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error });
    }
})

module.exports = userRouter