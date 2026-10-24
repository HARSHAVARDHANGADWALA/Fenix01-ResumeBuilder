const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const educationRoutes = require("./routes/educationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "CareerForge API is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CareerForge backend running on port ${PORT}`);
});