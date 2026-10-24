import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    FileTextIcon,
    ArrowDownTrayIcon,
} from "../components/ui/Icons";

interface ProfileData {
    phone: string;
    location: string;
    headline: string;
    bio: string;
    linkedin_url: string;
    portfolio_url: string;
}
interface Skill { id: number; skill_name: string; }
interface EduRecord { id: number; degree: string; institution: string; field_of_study: string; start_year: number | null; end_year: number | null; grade: string; description: string; }
interface Project { id: number; title: string; description: string; technologies: string; github_url: string; live_url: string; start_date: string; end_date: string; }
interface ExpRecord { id: number; job_title: string; company: string; location: string; start_date: string; end_date: string; is_current: boolean; description: string; }
interface Cert { id: number; name: string; issuing_organization: string; issue_date: string; credential_id: string; credential_url: string; }

type ResumeTheme = "modern" | "executive" | "minimal";

const ACCENTS = [
    { label: "Indigo", hex: "#6366f1" },
    { label: "Emerald", hex: "#10b981" },
    { label: "Ocean", hex: "#0284c7" },
    { label: "Crimson", hex: "#e11d48" },
    { label: "Slate", hex: "#334155" },
];

function ResumeBuilder() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [education, setEducation] = useState<EduRecord[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [experience, setExperience] = useState<ExpRecord[]>([]);
    const [certs, setCerts] = useState<Cert[]>([]);
    const [loading, setLoading] = useState(true);

    // Customization state
    const [theme, setTheme] = useState<ResumeTheme>("modern");
    const [accentColor, setAccentColor] = useState<string>("#6366f1");
    const [showBio, setShowBio] = useState(true);
    const [showExperience, setShowExperience] = useState(true);
    const [showProjects, setShowProjects] = useState(true);
    const [showEducation, setShowEducation] = useState(true);
    const [showSkills, setShowSkills] = useState(true);
    const [showCerts, setShowCerts] = useState(true);

    useEffect(() => {
        Promise.all([
            apiRequest("/profile").then((d) => setProfile(d.profile)).catch(() => {}),
            apiRequest("/skills").then((d) => setSkills(d.skills)).catch(() => {}),
            apiRequest("/education").then((d) => setEducation(d.education)).catch(() => {}),
            apiRequest("/projects").then((d) => setProjects(d.projects)).catch(() => {}),
            apiRequest("/experience").then((d) => setExperience(d.experience)).catch(() => {}),
            apiRequest("/certifications").then((d) => setCerts(d.certifications)).catch(() => {}),
        ]).finally(() => setLoading(false));
    }, []);

    const fmt = (date: string) =>
        date ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
    const fmtYear = (y: number | null) => (y ? String(y) : "");

    const handlePrint = () => window.print();

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="skeleton skeleton-title" style={{ width: 180 }} />
                    <div className="skeleton skeleton-text mt-2" style={{ width: 300 }} />
                </div>
                <div className="skeleton skeleton-card" style={{ height: 420 }} />
            </div>
        );
    }

    const hasContent =
        profile ||
        skills.length > 0 ||
        education.length > 0 ||
        experience.length > 0 ||
        projects.length > 0;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Interactive Resume Builder</h1>
                        <p className="page-description">
                            Customizable ATS-ready resume engine generated directly from your live Fenix database.
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handlePrint}
                        disabled={!hasContent}
                    >
                        <ArrowDownTrayIcon size={16} /> Export to PDF / Print
                    </button>
                </div>
            </div>

            {/* Customization Toolbar */}
            <div className="card card-padded" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                    {/* Theme selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                            Layout Theme:
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                            <button
                                className={`btn btn-sm ${theme === "modern" ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setTheme("modern")}
                            >
                                Modern Tech
                            </button>
                            <button
                                className={`btn btn-sm ${theme === "executive" ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setTheme("executive")}
                            >
                                Executive
                            </button>
                            <button
                                className={`btn btn-sm ${theme === "minimal" ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setTheme("minimal")}
                            >
                                Minimalist
                            </button>
                        </div>
                    </div>

                    {/* Accent Color Picker */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                            Accent Color:
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                            {ACCENTS.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setAccentColor(c.hex)}
                                    title={c.label}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: c.hex,
                                        border: accentColor === c.hex ? "2px solid white" : "none",
                                        boxShadow: accentColor === c.hex ? "0 0 0 2px " + c.hex : "none",
                                        cursor: "pointer",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Section toggles */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: "0.8125rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showBio} onChange={(e) => setShowBio(e.target.checked)} />
                            Bio
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showExperience} onChange={(e) => setShowExperience(e.target.checked)} />
                            Experience
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showProjects} onChange={(e) => setShowProjects(e.target.checked)} />
                            Projects
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showEducation} onChange={(e) => setShowEducation(e.target.checked)} />
                            Education
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showSkills} onChange={(e) => setShowSkills(e.target.checked)} />
                            Skills
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={showCerts} onChange={(e) => setShowCerts(e.target.checked)} />
                            Certifications
                        </label>
                    </div>
                </div>
            </div>

            {/* Resume Preview Canvas */}
            {!hasContent ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FileTextIcon size={40} color="var(--accent)" />
                        </div>
                        <div className="empty-title">Your profile is currently empty</div>
                        <div className="empty-description">
                            Use the "1-Click Demo Profile" button on the Dashboard to instantly populate your resume with sample engineering experience!
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    id="resume-print"
                    style={{
                        background: "#ffffff",
                        color: "#0f172a",
                        borderRadius: "var(--radius-lg)",
                        padding: theme === "minimal" ? "32px 36px" : "44px 48px",
                        boxShadow: "var(--shadow-xl)",
                        maxWidth: 860,
                        margin: "0 auto",
                        fontFamily: theme === "executive" ? '"Georgia", serif' : 'var(--font-sans)',
                        lineHeight: 1.55,
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            borderBottom: `2px solid ${accentColor}`,
                            paddingBottom: 18,
                            marginBottom: 22,
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                            <div>
                                <h1
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        margin: 0,
                                        letterSpacing: "-0.03em",
                                        color: "#0f172a",
                                    }}
                                >
                                    {user?.name || "Candidate Name"}
                                </h1>
                                {profile?.headline && (
                                    <div style={{ fontSize: 15, fontWeight: 600, color: accentColor, marginTop: 4 }}>
                                        {profile.headline}
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: "right", fontSize: 13, color: "#475569" }}>
                                {profile?.location && <div>{profile.location}</div>}
                                {user?.email && <div>{user.email}</div>}
                                {profile?.phone && <div>{profile.phone}</div>}
                            </div>
                        </div>

                        {/* Links bar */}
                        {(profile?.linkedin_url || profile?.portfolio_url) && (
                            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: accentColor, fontWeight: 500 }}>
                                {profile?.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{ color: accentColor }}>
                                        LinkedIn Profile ↗
                                    </a>
                                )}
                                {profile?.portfolio_url && (
                                    <a href={profile.portfolio_url} target="_blank" rel="noreferrer" style={{ color: accentColor }}>
                                        Portfolio Website ↗
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Summary / Bio */}
                    {showBio && profile?.bio && (
                        <div style={{ marginBottom: 20 }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    marginBottom: 6,
                                }}
                            >
                                Professional Summary
                            </div>
                            <p style={{ margin: 0, fontSize: 13.5, color: "#334155" }}>
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {showExperience && experience.length > 0 && (
                        <div style={{ marginBottom: 22 }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    borderBottom: "1px solid #e2e8f0",
                                    paddingBottom: 4,
                                    marginBottom: 12,
                                }}
                            >
                                Work Experience
                            </div>

                            {experience.map((exp) => (
                                <div key={exp.id} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                        <strong style={{ fontSize: 14.5, color: "#0f172a" }}>
                                            {exp.job_title}
                                        </strong>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>
                                            {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                                        {exp.company} {exp.location ? `· ${exp.location}` : ""}
                                    </div>
                                    {exp.description && (
                                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#334155" }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Featured Projects */}
                    {showProjects && projects.length > 0 && (
                        <div style={{ marginBottom: 22 }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    borderBottom: "1px solid #e2e8f0",
                                    paddingBottom: 4,
                                    marginBottom: 12,
                                }}
                            >
                                Technical Projects & Artifacts
                            </div>

                            {projects.map((proj) => (
                                <div key={proj.id} style={{ marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                        <strong style={{ fontSize: 14, color: "#0f172a" }}>
                                            {proj.title}
                                        </strong>
                                        <div style={{ fontSize: 12, display: "flex", gap: 10 }}>
                                            {proj.github_url && (
                                                <a href={proj.github_url} style={{ color: accentColor }}>
                                                    Source
                                                </a>
                                            )}
                                            {proj.live_url && (
                                                <a href={proj.live_url} style={{ color: accentColor }}>
                                                    Live
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {proj.technologies && (
                                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, margin: "1px 0" }}>
                                            Technologies: {proj.technologies}
                                        </div>
                                    )}

                                    <p style={{ margin: "3px 0 0", fontSize: 13, color: "#334155" }}>
                                        {proj.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education */}
                    {showEducation && education.length > 0 && (
                        <div style={{ marginBottom: 22 }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    borderBottom: "1px solid #e2e8f0",
                                    paddingBottom: 4,
                                    marginBottom: 12,
                                }}
                            >
                                Education & Academic Credentials
                            </div>

                            {education.map((edu) => (
                                <div key={edu.id} style={{ marginBottom: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <strong style={{ fontSize: 14, color: "#0f172a" }}>
                                            {edu.degree} {edu.field_of_study ? `· ${edu.field_of_study}` : ""}
                                        </strong>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>
                                            {fmtYear(edu.start_year)} {edu.end_year ? `– ${fmtYear(edu.end_year)}` : ""}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: "#475569" }}>
                                        {edu.institution} {edu.grade ? `· GPA: ${edu.grade}` : ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Technical Skills */}
                    {showSkills && skills.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    borderBottom: "1px solid #e2e8f0",
                                    paddingBottom: 4,
                                    marginBottom: 10,
                                }}
                            >
                                Core Competencies & Skills
                            </div>
                            <div style={{ fontSize: 13, color: "#334155", display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                                {skills.map((s) => (
                                    <span
                                        key={s.id}
                                        style={{
                                            background: "#f1f5f9",
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {s.skill_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {showCerts && certs.length > 0 && (
                        <div>
                            <div
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: accentColor,
                                    borderBottom: "1px solid #e2e8f0",
                                    paddingBottom: 4,
                                    marginBottom: 10,
                                }}
                            >
                                Certifications
                            </div>
                            {certs.map((c) => (
                                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                                    <span>
                                        <strong>{c.name}</strong> {c.issuing_organization ? `· ${c.issuing_organization}` : ""}
                                    </span>
                                    {c.issue_date && (
                                        <span style={{ fontSize: 12, color: "#64748b" }}>
                                            {new Date(c.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @media print {
                    body > * { display: none !important; }
                    #resume-print {
                        display: block !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default ResumeBuilder;
