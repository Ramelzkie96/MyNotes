import { getAuth } from "@clerk/express";

export const requireUser = (req, res, next) => {
  const { isAuthenticated, userId } = getAuth(req);


  if (!isAuthenticated || !userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.userId = userId;

  next();
};