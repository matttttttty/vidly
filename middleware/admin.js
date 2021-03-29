function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res.statues(403).send("only admin can delete..");

  next();
}

module.exports = admin;
