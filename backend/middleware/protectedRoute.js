require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');

const protectRoute = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}
        // console.log(decoded)
        const result = await findUserById(decoded.userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
          }
          req.user = result;
        //   console.log(req.user);
          next();
          // Respond with the user data
        //   res.json(result);

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = protectRoute;