const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL EXPERIENCE
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM experience
             WHERE user_id = $1
             ORDER BY start_date DESC NULLS LAST`,
            [req.user.userId]
        );

        res.json({
            experience: result.rows
        });

    } catch (error) {
        console.error("Get experience error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ADD EXPERIENCE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            job_title,
            company,
            location,
            start_date,
            end_date,
            is_current,
            description
        } = req.body;

        if (!job_title || !company) {
            return res.status(400).json({
                message: "Job title and company are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO experience
            (
                user_id,
                job_title,
                company,
                location,
                start_date,
                end_date,
                is_current,
                description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                req.user.userId,
                job_title,
                company,
                location || null,
                start_date || null,
                end_date || null,
                is_current || false,
                description || null
            ]
        );

        res.status(201).json({
            message: "Experience added successfully",
            experience: result.rows[0]
        });

    } catch (error) {
        console.error("Add experience error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE EXPERIENCE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const experienceId = req.params.id;

        const result = await pool.query(
            `DELETE FROM experience
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [experienceId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Experience record not found"
            });
        }

        res.json({
            message: "Experience deleted successfully"
        });

    } catch (error) {
        console.error("Delete experience error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;