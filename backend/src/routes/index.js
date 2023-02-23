import * as express from "express";

export const router = express.Router();

// TODO: move routing logic into this file
router.get("/hello", (req, res) => {
	res.json({ name: "hello" });
});
