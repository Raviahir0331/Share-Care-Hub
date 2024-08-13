const usecontoller = require("../Controller/userContoller");
const express = require("express");
const router = express.Router();
router.post("/adduser", usecontoller.insertData);
router.post("/signin", usecontoller.getUser);
module.exports = router;
