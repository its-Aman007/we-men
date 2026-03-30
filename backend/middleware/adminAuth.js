import jwt from 'jsonwebtoken';

// middleware protecting admin-only routes
const adminAuth = (req, res, next) => {
    try {
        // tokens are usually sent in the Authorization header (Bearer <token>),
        // but some clients may put them in the body or query string during testing.
        // check common header names including a bare 'token' to match Thunder Client
        let authHeader = req.headers.authorization || req.headers['x-access-token'] || req.headers.token;
        let token = null;

        if (authHeader) {
            // strip "Bearer " prefix if present
            token = authHeader.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : authHeader;
        }

        // fallback to body/query for convenience/testing
        if (!token) {
            token = req.body?.token || req.query?.token;
        }

        if (!token) {
            console.log('[adminAuth] missing token, headers:', req.headers);
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        if (typeof token !== 'string') {
            return res.status(401).json({ success: false, message: 'Invalid token format' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // adminLogin signs { email, password }
        if (
            decoded.email !== process.env.ADMIN_EMAIL ||
            decoded.password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default adminAuth;