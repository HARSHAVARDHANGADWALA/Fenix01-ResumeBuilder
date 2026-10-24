const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL PROJECTS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM projects
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        res.json({
            projects: result.rows
        });

    } catch (error) {
        console.error("Get projects error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// GET SINGLE PROJECT
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.id;

        const result = await pool.query(
            `SELECT *
             FROM projects
             WHERE id = $1
             AND user_id = $2`,
            [projectId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            project: result.rows[0]
        });

    } catch (error) {
        console.error("Get project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ADD PROJECT
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            technologies,
            github_url,
            live_url,
            start_date,
            end_date
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Project title and description are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO projects
            (
                user_id,
                title,
                description,
                technologies,
                github_url,
                live_url,
                start_date,
                end_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                req.user.userId,
                title,
                description,
                technologies || null,
                github_url || null,
                live_url || null,
                start_date || null,
                end_date || null
            ]
        );

        res.status(201).json({
            message: "Project added successfully",
            project: result.rows[0]
        });

    } catch (error) {
        console.error("Add project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const projectId = req.params.id;

        const result = await pool.query(
            `DELETE FROM projects
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [projectId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;