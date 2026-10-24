import { useEffect, useState } from "react";
import apiRequest from "../services/api";

interface Skill { id: number; skill_name: string; }

const roles = [
    {
        title: "Frontend Developer",
        icon: "🖥",
        levels: ["Junior", "Mid", "Senior"],
        description: "Builds web UIs using JavaScript frameworks, HTML, and CSS.",
        skills: {
            Junior: ["HTML", "CSS", "JavaScript", "React or Vue basics", "Git", "Responsive design"],
            Mid: ["TypeScript", "React/Vue", "State management", "Testing (Jest)", "REST APIs", "Performance optimization"],
            Senior: ["Architecture decisions", "System design", "Mentoring", "Cross-browser compatibility", "Accessibility", "Build tooling"],
        },
    },
    {
        title: "Backend Developer",
        icon: "⚙",
        levels: ["Junior", "Mid", "Senior"],
        description: "Designs APIs, databases, and server-side application logic.",
        skills: {
            Junior: ["Node.js or Python", "SQL basics", "REST API basics", "Git", "Basic auth"],
            Mid: ["Database design", "Auth & JWT", "Docker", "Testing", "Message queues"],
            Senior: ["System design", "Scalability", "Security", "Monitoring", "Team leadership"],
        },
    },
    {
        title: "Full Stack Developer",
        icon: "◈",
        levels: ["Junior", "Mid", "Senior"],
        description: "Works across both frontend and backend layers.",
        skills: {
            Junior: ["HTML/CSS/JS", "React basics", "Node.js or Python", "SQL", "Git"],
            Mid: ["TypeScript", "Full stack framework", "REST/GraphQL", "Docker", "Testing"],
            Senior: ["Architecture", "DevOps basics", "CI/CD", "Performance", "Mentoring"],
        },
    },
    {
        title: "DevOps Engineer",
        icon: "🔧",
        levels: ["Junior", "Mid", "Senior"],
        description: "Manages infrastructure, deployment pipelines, and reliability.",
        skills: {
            Junior: ["Linux basics", "Git", "Docker basics", "CI/CD basics", "Bash scripting"],
            Mid: ["Kubernetes", "Terraform", "AWS/GCP/Azure", "Monitoring", "Security"],
            Senior: ["Cloud architecture", "SRE practices", "Cost optimization", "Multi-cloud", "Incident management"],
        },
    },
    {
        title: "Data Scientist",
        icon: "📊",
        levels: ["Junior", "Mid", "Senior"],
        description: "Analyzes data, builds models, and generates insights.",
        skills: {
            Junior: ["Python", "Pandas", "NumPy", "SQL", "Data visualization"],
            Mid: ["Machine learning", "Scikit-learn", "Feature engineering", "Statistics", "Model evaluation"],
            Senior: ["Deep learning", "MLOps", "Production deployment", "Team leadership", "Research"],
        },
    },
    {
        title: "Mobile Developer",
        icon: "📱",
        levels: ["Junior", "Mid", "Senior"],
        description: "Builds iOS, Android, or cross-platform mobile apps.",
        skills: {
            Junior: ["Swift or Kotlin basics", "React Native basics", "Git", "REST APIs", "UI design basics"],
            Mid: ["State management", "Offline support", "Push notifications", "Testing", "App store publishing"],
            Senior: ["Architecture (MVVM/Clean)", "Performance profiling", "Security", "Mentoring", "CI/CD for mobile"],
        },
    },
];

function normalize(s: string) { return s.toLowerCase().replace(/[^a-z0-9]/g, ""); }

function CareerRoles() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedRole, setSelectedRole] = useState<(typeof roles)[0] | null>(null);
    const [selectedLevel, setSelectedLevel] = useState("Mid");

    useEffect(() => {
        apiRequest("/skills").then(d => setSkills(d.skills)).catch(() => {});
    }, []);

    const userNorm = skills.map(s => normalize(s.skill_name));
    const hasSkill = (skill: string) => {
        const n = normalize(skill);
        return userNorm.some(u => u.includes(n) || n.includes(u) && n.length > 2);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Career Roles</h1>
                        <p className="page-description">Explore common developer career paths and see how your skills compare at each level.</p>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
                {roles.map((role) => (
                    <button
                        key={role.title}
                        onClick={() => { setSelectedRole(role); setSelectedLevel("Mid"); }}
                        style={{
                            background: "var(--bg-card)",
                            border: `1px solid ${selectedRole?.title === role.title ? "var(--accent)" : "var(--border)"}`,
                            borderRadius: "var(--radius-lg)",
                            padding: "18px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "border-color 150ms ease, box-shadow 150ms ease",
                            boxShadow: selectedRole?.title === role.title ? "var(--shadow-focus)" : "none",
                        }}
                    >
                        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{role.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)" }}>{role.title}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>{role.description}</div>
                    </button>
                ))}
            </div>

            {selectedRole && (
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "1rem" }}>{selectedRole.icon} {selectedRole.title}</div>
                            <div className="text-muted text-sm">{selectedRole.description}</div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                            {selectedRole.levels.map(level => (
                                <button
                                    key={level}
                                    className={`btn btn-sm ${selectedLevel === level ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setSelectedLevel(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        <div style={{ fontWeight: 600, marginBottom: 12 }}>
                            Skills for {selectedLevel} {selectedRole.title}
                        </div>
                        <div className="skill-tags">
                            {(selectedRole.skills as Record<string, string[]>)[selectedLevel].map((skill) => (
                                <span
                                    key={skill}
                                    className={`badge ${hasSkill(skill) ? "badge-success" : "badge-default"}`}
                                    title={hasSkill(skill) ? "You have this skill" : "Not in your skills list"}
                                >
                                    {hasSkill(skill) ? "✓ " : ""}{skill}
                                </span>
                            ))}
                        </div>
                        {skills.length === 0 && (
                            <p className="text-muted text-sm" style={{ marginTop: 12 }}>
                                <a href="/skills" style={{ color: "var(--text-link)" }}>Add your skills</a> to see which ones you already have.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CareerRoles;
