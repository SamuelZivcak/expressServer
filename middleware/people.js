function validateID(req, res, next) {
    const personID = Number.parseInt(req.params.id);
    if (personID && personID >= 0) next();
    else return res.status(400).send("non valid id");
  }
  
  function validateCompressed(req, res, next) {
    const { compressed } = req.query;
    if (compressed !== "true" && compressed !== "false") {
      return res.status(400).send();
    }
    next();
  }
  
  function compressedToBool(req, res, next) {
    const compressed = req.query;
    if (compressed === "true") req.query = true;
  
    req.query = false;
    next();
  }
  
  function idToInt(req, res, next) {
    req.params.id = Number.parseInt(req.params.id);
    next();
  }
  
  function validatePostBody(req, res, next) {
    if (req.body.name && req.body.surname && req.body.telephone && req.body.email)
      next();
  
    return res
      .status(400)
      .json({message: "Fill all parameters: name, surname, telephone, email"});
  }
  
  module.exports = {
    validateID,
    validateCompressed,
    compressedToBool,
    idToInt,
    validatePostBody
  };