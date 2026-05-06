const { searchResult } = require("../Controllers/searchController");
const searchRouter = require("express").Router();

searchRouter.post("/searchResult", searchResult);

module.exports = searchRouter;