const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const skills = await pool.query(
            "SELECT COUNT(*) FROM skills WHERE user_id = $1",
            [userId]
        );

        const projects = await pool.query(
            "SELECT COUNT(*) FROM projects WHERE user_id = $1",
            [userId]
        );

        const education = await pool.query(
            "SELECT COUNT(*) FROM education WHERE user_id = $1",
            [userId]
        );

        const experience = await pool.query(
            "SELECT COUNT(*) FROM experience WHERE user_id = $1",
            [userId]
        );

        const certifications = await pool.query(
            "SELECT COUNT(*) FROM certifications WHERE user_id = $1",
            [userId]
        );

        res.json({
            skillsCount: Number(skills.rows[0].count),
            projectsCount: Number(projects.rows[0].count),
            educationCount: Number(education.rows[0].count),
            experienceCount: Number(experience.rows[0].count),
            certificationsCount: Number(certifications.rows[0].count)
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            message: "Unable to load dashboard data"
        });
    }
});

module.exports = router;