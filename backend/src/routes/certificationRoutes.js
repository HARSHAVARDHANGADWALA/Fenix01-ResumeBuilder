const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL CERTIFICATIONS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM certifications
             WHERE user_id = $1
             ORDER BY issue_date DESC NULLS LAST`,
            [req.user.userId]
        );

        res.json({
            certifications: result.rows
        });

    } catch (error) {
        console.error("Get certifications error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ADD CERTIFICATION
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            issuing_organization,
            issue_date,
            credential_id,
            credential_url
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Certification name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO certifications
            (
                user_id,
                name,
                issuing_organization,
                issue_date,
                credential_id,
                credential_url
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                req.user.userId,
                name,
                issuing_organization || null,
                issue_date || null,
                credential_id || null,
                credential_url || null
            ]
        );

        res.status(201).json({
            message: "Certification added successfully",
            certification: result.rows[0]
        });

    } catch (error) {
        console.error("Add certification error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE CERTIFICATION
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const certificationId = req.params.id;

        const result = await pool.query(
            `DELETE FROM certifications
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [certificationId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Certification not found"
            });
        }

        res.json({
            message: "Certification deleted successfully"
        });

    } catch (error) {
        console.error("Delete certification error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;