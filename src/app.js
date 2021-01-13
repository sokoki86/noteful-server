require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./middleware/bearer-token')
const errorHandler = require('./middleware/error-handler')
const folderRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router')
const {CLIENT_ORIGIN} = require('./config');
const app = express();

const morganOption = (NODE_ENV === 'production') ? "tiny" : "common"

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);
app.use(morgan(morganOption));
app.use(helmet());


app.use(errorHandler)
// app.use(validateBearerToken);

app.use("/api/folders", folderRouter)
app.use("/api/notes", notesRouter)


module.exports = app;

  // intercept OPTIONS method
 