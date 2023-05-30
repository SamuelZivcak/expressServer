function validateUserId(req, res, next) {
  const userId = req.query.userId;
  if (userId && userId >= 0) {
    req.query.userId = parseInt(userId);
    next();
  } else return res.status(400).send();
}

function transformCompleted(req, res, next) {
  const completed = req.query.completed;
  if (!completed) {
    return next();
  }
  if (completed !== "true" && completed !== "false") {
    return res.status(400).send();
  }

  req.query.completed = completed === "true";

  next();
}

function validateOnlyText(req, res, next) {
  const textOnly = req.query.textOnly;
  if (!textOnly) return next();
  if (textOnly !== "true" && textOnly !== "false") {
    return res.status(400).send();
  }
  req.query.textOnly = textOnly === "true";
  next();
}

module.exports = { transformCompleted, validateUserId, validateOnlyText };
