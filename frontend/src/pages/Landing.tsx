import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
    );
}
function MoonIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    );
}

const features = [
    { icon: "📄", title: "Resume Intelligence", desc: "Generate a polished, tailored resume from your profile. Export or print in seconds." },
    { icon: "⚡", title: "Skill Evidence", desc: "Document your skills with project evidence. Turn what you know into what you can prove." },
    { icon: "🔍", title: "Job Description Analysis", desc: "Paste a job description and instantly see which skills match and what you might need." },
    { icon: "◎", title: "Skill Gap Insights", desc: "Compare your current skills against common role requirements and identify where to grow." },
    { icon: "⎇", title: "GitHub Integration", desc: "Pull in your public GitHub repositories to showcase real, working code in your profile." },
    { icon: "🧭", title: "Career Role Explorer", desc: "Explore career paths and see what skills are expected at each level and discipline." },
];

function Landing() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Nav */}
            <nav className="landing-nav">
                <Link to="/" className="landing-logo">
                    <div className="landing-logo-mark">F</div>
                    <span className="landing-logo-text">Fenix</span>
                </Link>
                <div className="landing-nav-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={theme === "dark" ? "Light mode" : "Dark mode"}
                    >
                        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="landing-hero">
                <div className="hero-eyebrow">
                    ✦ Career Intelligence Platform
                </div>
                <h1 className="hero-title">
                    Your skills have a story.{" "}
                    <span className="hero-title-accent">Fenix helps the world see it.</span>
                </h1>
                <p className="hero-description">
                    Build a stronger resume, discover your career potential, identify skill
                    gaps, and turn your projects into evidence of what you can do.
                </p>
                <div className="hero-actions">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/register")}
                    >
                        Get Started — it's free
                    </button>
                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={() => navigate("/login")}
                    >
                        Explore Fenix
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="landing-features">
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <h2 style={{ fontSize: "clamp(1.375rem, 3vw, 1.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 10 }}>
                        Everything you need to own your career
                    </h2>
                    <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", fontSize: "0.9375rem" }}>
                        Fenix connects your projects, skills, and experience into a coherent professional story — backed by real evidence.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((f) => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon">{f.icon}</div>
                            <div className="feature-title">{f.title}</div>
                            <div className="feature-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="landing-cta">
                <h2>Ready to tell your career story?</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: "0.9375rem" }}>
                    Create your free Fenix account and start building in minutes.
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/register")}>
                    Create your account
                </button>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="flex items-center gap-2">
                    <div className="landing-logo-mark" style={{ width: 22, height: 22, fontSize: 10 }}>F</div>
                    <span style={{ fontWeight: 600 }}>Fenix</span>
                </div>
                <span>Built with purpose. Career intelligence for developers.</span>
            </footer>
        </div>
    );
}

export default Landing;
