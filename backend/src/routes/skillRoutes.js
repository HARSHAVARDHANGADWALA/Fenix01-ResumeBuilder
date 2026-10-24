const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL SKILLS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM skills
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.userId]
        );

        res.json({
            skills: result.rows
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ADD SKILL
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { skill_name } = req.body;

        if (!skill_name || !skill_name.trim()) {
            return res.status(400).json({
                message: "Skill name is required"
            });
        }

        const skill = skill_name.trim();

        // Check if skill already exists
        const existingSkill = await pool.query(
            `SELECT id
             FROM skills
             WHERE user_id = $1
             AND LOWER(skill_name) = LOWER($2)`,
            [req.user.userId, skill]
        );

        if (existingSkill.rows.length > 0) {
            return res.status(409).json({
                message: "Skill already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO skills (user_id, skill_name)
             VALUES ($1, $2)
             RETURNING *`,
            [req.user.userId, skill]
        );

        res.status(201).json({
            message: "Skill added successfully",
            skill: result.rows[0]
        });

    } catch (error) {
        console.error("Add skill error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// DELETE SKILL
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const skillId = req.params.id;

        const result = await pool.query(
            `DELETE FROM skills
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [skillId, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.json({
            message: "Skill deleted successfully"
        });

    } catch (error) {
        console.error("Delete skill error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;