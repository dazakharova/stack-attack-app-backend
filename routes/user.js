const userRouter = require('express').Router();
const { query } = require('../db/index.js');
const { authenticateToken } = require('../middleware/authentication');

// Update a prifle picture
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