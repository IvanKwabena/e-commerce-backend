function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'The User is not authorized' });
  }
  if (err.name === 'ValidationError') {
    // validation error
    return res.status(401).send(err);
  }
  //  else {
  //   // general error in the server
   
  //   return res
  //     .status(500)
  //     .json({ error: err, message: 'Error Handler General error' });
  // }
}

module.exports = errorHandler;
