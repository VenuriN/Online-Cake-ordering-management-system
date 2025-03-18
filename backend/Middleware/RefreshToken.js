import jwt from 'jsonwebtoken';

const refreshToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10s" }
        );

        res.cookie("accessToken", newToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 10 * 1000),
        });

        req.user = decoded;
        next();
    });
};

export default refreshToken;
