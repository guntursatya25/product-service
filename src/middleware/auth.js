const axios = require("axios");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = tokenHeader.replace("Bearer ", "");

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const response = await axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(token);

    // console.log(response.data);
    if (!response.data.id) {
      throw new Error();
    }

    req.user = response.data;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
