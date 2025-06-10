import jwt from 'jsonwebtoken';

export function signToken(payload) {
    const token = jwt.sign(
        payload,
        process.env.MYSUPERSECRET,
        { expiresIn: 60 * 60 }
    );
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.MYSUPERSECRET);
        return decoded;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

export function extractToken(req) {
    const authHeader = req.headers.authorization || '';
    return authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
}