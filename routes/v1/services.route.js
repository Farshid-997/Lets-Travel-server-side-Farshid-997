const express = require("express");

const router = express.Router();

// router.post("/", (req, res) => {});

router
  .route("/")
  .get((req, res) => {})
  .post((req, res) => {});

module.exports = router;
