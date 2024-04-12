export function active (req, res, next) {
    if (req.session.user) {
      return res.redirect("/profile");
    }
    next();
  }
