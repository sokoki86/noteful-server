const { NODE_ENV } = require('../config')

module.exports = function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') 
    
    {
      console.log(error);
      response = { error: { message: "server error" } };
    } else {
      console.error(error);
      response = { message: error.message, error };
    }
    res.status(500).json(response);
  }