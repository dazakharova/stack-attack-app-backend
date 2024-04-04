const jwt = require('jsonwebtoken')

// Middleware to authenticate and authorize users
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return response.sendStatus(401); // If no token, deny access

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return response.sendStatus(403); // If token is not valid or expired
        request.user = user;
        next();
    });
};

module.exports = { authenticateToken };

