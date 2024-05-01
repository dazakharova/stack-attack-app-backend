const jwt = require('jsonwebtoken');

// Middleware to authenticate and authorize users
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('got token!!!', token)

    if (!token) {
        console.error('Empty token');
        return response.sendStatus(401); // If no token, deny access
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error('Verify token: ' + error)
            return response.sendStatus(403)
        } // If token is not valid or expired
        request.userID = user.userId;
        next();
    });
};

module.exports = { authenticateToken };
