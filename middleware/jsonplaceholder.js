function validateUserId(req, res, next) {
  const userId = req.query.userId;
  if (userId && userId >= 0) {
    req.query.userId = parseInt(userId);
    next();
  }
  return res.status(400).send();
}

function transformCompleted(req, res, next) {
  const completed = req.query.completed;
  if (completed !== "true" && completed !== "false") {
    return res.status(400).send();
  }

  if(completed === "true")
  req.query.completed = true;
  else
  req.query.completed = false;

  next();
}

module.exports = { transformCompleted, validateUserId };
