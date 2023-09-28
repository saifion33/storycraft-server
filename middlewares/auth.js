/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ status: 403, message: 'provide auth header'});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ status: 403, message: 'provide auth token'});
        }
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeData) {
            return res.status(401).json({ status: 401, message: 'invalid auth token'});
        }
        req.userId = decodeData?._id
        next();
    } catch (error) {
        console.log(error);
        if (error.message==='jwt expired') {
            return res.status(401).json({message:'session expired.' });
        }
        res.status(500).json({ status: 500, message:'Internal Server Error'})
    }
}
export default auth