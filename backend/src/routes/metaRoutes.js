import express from "express";
import states from "../static/states.js";

const router = express.Router();

router.get("/states", (req, res) => {
  res.json(states);
});

export default router;