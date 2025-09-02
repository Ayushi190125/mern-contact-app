import express from "express";
import Record from "../models/Record.js";

const router = express.Router();

const ALLOWED_SORT = new Set(["first","last", "phone", "email", "address", "state", "district", "createdAt", "updatedAt"]);
const sanitizeSort = (sort) => (ALLOWED_SORT.has(sort) ? sort : "createdAt");
const sanitizeOrder = (order) => (order === "asc" ? 1 : -1);


router.post("/", async (req, res) => {
  try {
    const record = await Record.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 100);
    const search = (req.query.search || "").trim();
    const sort = sanitizeSort(req.query.sort || "createdAt");
    const order = sanitizeOrder(req.query.order || "desc");

    const query = search
      ? {
        $or: [
          { first: new RegExp(search, "i") },
          { last: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
          { phone: new RegExp(search, "i") },
          { address: new RegExp(search, "i") },
          { state: new RegExp(search, "i") },
          { district: new RegExp(search, "i") },
          { city: new RegExp(search, "i") },
          { zipCode: new RegExp(search, "i") },
        ]
      }
      : {};

    const [records, total] = await Promise.all([
      Record.find(query)
        .sort({ [sort]: order })
        .skip((page - 1) * limit)
        .limit(limit),
      Record.countDocuments(query)
    ]);

    res.json({ records, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Record not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;