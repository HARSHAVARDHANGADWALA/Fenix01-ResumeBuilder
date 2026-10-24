import { useEffect, useState } from "react";
import apiRequest from "../services/api";

interface Skill { id: number; skill_name: string; }

const roles: Record<string, { description: string; skills: string[] }> = {
    "Frontend Developer": {
        description: "Builds user interfaces and web applications using modern JavaScript frameworks.",
        skills: ["html", "css", "javascript", "typescript", "react", "vue", "angular", "git", "responsive design", "testing"],
    },
    "Backend Developer": {
        description: "Designs and builds server-side APIs, databases, and business logic.",
        skills: ["nodejs", "python", "java", "go", "sql", "postgresql", "mongodb", "rest api", "docker", "git"],
    },
    "Full Stack Developer": {
        description: "Works across frontend and backend to build complete web applications.",
        skills: ["javascript", "typescript", "react", "nodejs", "sql", "postgresql", "git", "docker", "rest api", "html", "css"],
    },
    "DevOps / SRE": {
        description: "Manages infrastructure, deployments, and reliability of production systems.",
        skills: ["linux", "docker", "kubernetes", "aws", "terraform", "ci/cd", "bash", "python", "monitoring", "git"],
    },
    "Data Scientist": {
        description: "Analyzes data and builds models to generate insights and predictions.",
        skills: ["python", "pandas", "numpy", "scikit-learn", "sql", "machine learning", "statistics", "jupyter", "data visualization"],
    },
    "Mobile Developer": {
        description: "Builds native or cross-platform mobile applications.",
        skills: ["swift", "kotlin", "react native", "flutter", "typescript", "git", "rest api", "ui/ux", "testing"],
    },
};

function normalize(s: string) { return s.toLowerCase().replace(/[^a-z0-9]/g, ""); }

function SkillGaps() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiRequest("/skills")
            .then(d => setSkills(d.skills))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const userNorm = skills.map(s => normalize(s.skill_name));

    const getGaps = (roleSkills: string[]) => {
        const have: string[] = [];
        const need: string[] = [];
        roleSkills.forEach(rs => {
            const rsN = normalize(rs);
            if (userNorm.some(u => u.includes(rsN) || rsN.includes(u))) {
                have.push(rs);
            } else {
                need.push(rs);
            }
        });
        return { have, need };
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Skill Gap Analysis</h1>
                        <p className="page-description">
                            Compare your current skills against what's typically expected for common developer roles.
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="data-list">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}
                </div>
            ) : (
                <>
                    {skills.length === 0 && (
                        <div className="error-message" style={{ marginBottom: 20 }}>
                            You haven't added any skills yet. <a href="/skills" style={{ color: "var(--text-link)" }}>Add skills</a> to see your gaps.
                        </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
                        {Object.keys(roles).map((role) => {
                            const { have, need } = getGaps(roles[role].skills);
                            const pct = Math.round((have.length / roles[role].skills.length) * 100);
                            const isSelected = selectedRole === role;
                            return (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(isSelected ? null : role)}
                                    style={{
                                        background: "var(--bg-card)",
                                        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                                        borderRadius: "var(--radius-lg)",
                                        padding: "16px",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        transition: "border-color 150ms ease, box-shadow 150ms ease",
                                        boxShadow: isSelected ? "var(--shadow-focus)" : "none",
                                    }}
                                >
                                    <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-primary)" }}>{role}</div>
                                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: 12 }}>{need.length} gap{need.length !== 1 ? "s" : ""} · {have.length}/{roles[role].skills.length} skills</div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{pct}% ready</div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedRole && (() => {
                        const { have, need } = getGaps(roles[selectedRole].skills);
                        return (
                            <div className="card" style={{ marginTop: 4 }}>
                                <div className="card-header">
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{selectedRole}</div>
                                        <div className="text-muted text-sm">{roles[selectedRole].description}</div>
                                    </div>
                                </div>
                                <div className="card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--success)", marginBottom: 8 }}>✓ You have ({have.length})</div>
                                        <div className="skill-tags">
                                            {have.map(s => <span key={s} className="badge badge-success">{s}</span>)}
                                            {have.length === 0 && <span className="text-muted text-sm">None yet</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: "var(--error)", marginBottom: 8 }}>◎ To develop ({need.length})</div>
                                        <div className="skill-tags">
                                            {need.map(s => <span key={s} className="badge badge-error">{s}</span>)}
                                            {need.length === 0 && <span className="text-muted text-sm" style={{ color: "var(--success)" }}>You're fully ready!</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </>
            )}
        </div>
    );
}

export default SkillGaps;
