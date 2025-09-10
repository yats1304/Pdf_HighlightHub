import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request object
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}
