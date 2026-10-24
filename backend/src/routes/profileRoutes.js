const express = require("express");
const pool = require("../db/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET PROFILE
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM profiles
             WHERE user_id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// CREATE / UPDATE PROFILE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            phone,
            location,
            headline,
            bio,
            linkedin_url,
            portfolio_url
        } = req.body;

        const existingProfile = await pool.query(
            `SELECT id
             FROM profiles
             WHERE user_id = $1`,
            [req.user.userId]
        );

        let result;

        if (existingProfile.rows.length > 0) {

            result = await pool.query(
                `UPDATE profiles
                 SET
                    phone = $1,
                    location = $2,
                    headline = $3,
                    bio = $4,
                    linkedin_url = $5,
                    portfolio_url = $6,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $7
                 RETURNING *`,
                [
                    phone,
                    location,
                    headline,
                    bio,
                    linkedin_url,
                    portfolio_url,
                    req.user.userId
                ]
            );

        } else {

            result = await pool.query(
                `INSERT INTO profiles
                 (
                    user_id,
                    phone,
                    location,
                    headline,
                    bio,
                    linkedin_url,
                    portfolio_url
                 )
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [
                    req.user.userId,
                    phone,
                    location,
                    headline,
                    bio,
                    linkedin_url,
                    portfolio_url
                ]
            );
        }

        res.status(201).json({
            message: "Profile saved successfully",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Save profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;