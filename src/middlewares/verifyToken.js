import jwt from "jsonwebtoken";
import User from "../../models/user.js";


export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({message: "Unauthorized"});
        }

        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }
}

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Solo admin"
    });
  }

  next();
};