const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // token'in 3 yol ile gelmesine karşılık tokeni almak.
    const token = req.headers['x-access-token'] || req.body.token || req.query.token

    if (token) {
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'Failed to authenticate token'
                })
            }
            else {
                req.decode = decoded;
                console.log(decoded);
                next();
            }
        })
    }
    else {
        res.json({
            status: false,
            message: 'No token provided.'
        })
    }
};

