import jwt from "jsonwebtoken";

const authuser = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default authuser;