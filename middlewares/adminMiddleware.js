exports.adminMiddleware = (req, res, next) => {
  if (req.user.usertype !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
