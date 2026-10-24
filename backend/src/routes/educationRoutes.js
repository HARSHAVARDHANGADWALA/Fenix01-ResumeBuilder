const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL EDUCATION
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM education
             WHERE user_id = $1
             ORDER BY end_year DESC NULLS LAST`,
            [req.user.userId]
        );

        res.json({
            education: result.rows
        });

    } catch (error) {
        console.error("Get education error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ADD EDUCATION
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            degree,
            institution,
            field_of_study,
            start_year,
            end_year,
            grade,
            description
        } = req.body;

        if (!degree || !institution) {
            return res.status(400).json({
                message: "Degree and institution are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO education
            (
                user_id,
                degree,
                institution,
                field_of_study,
                start_year,
                end_year,
                grade,
                description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                req.user.userId,
                degree,
                institution,
                field_of_study || null,
                start_year || null,
                end_year || null,
                grade || null,
                description || null
            ]
        );

        res.status(201).json({
            message: "Education added successfully",
            education: result.rows[0]
        });

    } catch (error) {
        console.error("Add education error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE EDUCATION
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const educationId = req.params.id;

        const result = await pool.query(
            `DELETE FROM education
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [educationId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Education record not found"
            });
        }

        res.json({
            message: "Education deleted successfully"
        });

    } catch (error) {
        console.error("Delete education error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;