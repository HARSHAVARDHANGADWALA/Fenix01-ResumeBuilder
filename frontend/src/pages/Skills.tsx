import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import { BoltIcon, PlusIcon, CheckIcon, TrashIcon } from "../components/ui/Icons";

interface Skill {
    id: number;
    skill_name: string;
}

const SKILL_CATALOG: Record<string, string[]> = {
    "Frontend & UI": [
        "React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript",
        "HTML5", "CSS3", "Vue.js", "Figma", "Redux", "GraphQL", "Vite"
    ],
    "Backend & APIs": [
        "Node.js", "Express", "Python", "Go", "Java", "PostgreSQL",
        "MongoDB", "Redis", "REST APIs", "Microservices", "Prisma", "Django"
    ],
    "Cloud & DevOps": [
        "Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform",
        "GitHub Actions", "Nginx", "Google Cloud", "Monitoring"
    ],
    "Testing & Tools": [
        "Git", "Jest", "Cypress", "Postman", "Webpack", "Bash", "Agile"
    ],
    "AI & Data": [
        "Python", "Pandas", "NumPy", "TensorFlow", "PyTorch", "SQL", "LLMs", "Scikit-Learn"
    ],
};

function Skills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState("");
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Frontend & UI");
    const { addToast } = useToast();

    const fetchSkills = async () => {
        try {
            const data = await apiRequest("/skills");
            setSkills(data.skills);
        } catch {
            addToast("Failed to load skills", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAdd = async (skillName: string) => {
        const trimmed = skillName.trim();
        if (!trimmed) return;
        setAdding(true);
        try {
            const data = await apiRequest("/skills", {
                method: "POST",
                body: JSON.stringify({ skill_name: trimmed }),
            });
            setSkills((prev) => [data.skill, ...prev]);
            setNewSkill("");
            addToast(`Added "${trimmed}" to your skills`, "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to add skill", "error");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        setDeletingId(id);
        try {
            await apiRequest(`/skills/${id}`, { method: "DELETE" });
            setSkills((prev) => prev.filter((s) => s.id !== id));
            addToast(`Removed "${name}"`, "info");
        } catch {
            addToast("Failed to remove skill", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const userSkillNames = new Set(skills.map((s) => s.skill_name.toLowerCase()));

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Skills & Competencies</h1>
                        <p className="page-description">
                            Select from popular tech stacks or add your own custom proficiencies.
                        </p>
                    </div>
                    <span className="badge badge-accent">
                        {skills.length} Active Skill{skills.length !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>

            {/* Custom Add Form */}
            <div className="card card-padded" style={{ marginBottom: 20 }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAdd(newSkill);
                    }}
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                >
                    <div className="form-group" style={{ flex: 1, minWidth: 220 }}>
                        <label className="form-label" htmlFor="new-skill">
                            Custom Skill
                        </label>
                        <input
                            id="new-skill"
                            type="text"
                            className="form-input"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Type any skill (e.g. Apache Kafka, WebGL, Rust)…"
                            maxLength={60}
                        />
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={adding || !newSkill.trim()}
                        >
                            <PlusIcon size={16} /> Add Custom Skill
                        </button>
                    </div>
                </form>
            </div>

            {/* 1-Click Skill Suggestion Catalog */}
            <div className="card card-padded" style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                            Popular Skill Cloud (1-Click Add)
                        </div>
                        <div className="text-muted text-xs">
                            Click any pill below to instantly attach it to your profile.
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {Object.keys(SKILL_CATALOG).map((category) => (
                            <button
                                key={category}
                                className={`btn btn-sm ${activeTab === category ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setActiveTab(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="skill-tags">
                    {SKILL_CATALOG[activeTab].map((skillItem) => {
                        const isAdded = userSkillNames.has(skillItem.toLowerCase());
                        return (
                            <button
                                key={skillItem}
                                onClick={() => !isAdded && handleAdd(skillItem)}
                                disabled={isAdded || adding}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 14px",
                                    borderRadius: "999px",
                                    fontSize: "0.8125rem",
                                    fontWeight: 500,
                                    background: isAdded ? "var(--success-light)" : "var(--bg-card)",
                                    color: isAdded ? "var(--success-text)" : "var(--text-primary)",
                                    border: `1px solid ${isAdded ? "var(--success-border)" : "var(--border)"}`,
                                    cursor: isAdded ? "default" : "pointer",
                                    transition: "all var(--transition)",
                                }}
                            >
                                {isAdded ? (
                                    <>
                                        <CheckIcon size={13} />
                                        <span>{skillItem}</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon size={13} color="var(--accent)" />
                                        <span>{skillItem}</span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* User's Verified Skills */}
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Your Active Profile Skills</h2>
                <span className="text-muted text-xs">Used across Resume Builder and Job Matching</span>
            </div>

            {loading ? (
                <div className="skill-tags">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ width: 90 + i * 10, height: 34, borderRadius: 999 }} />
                    ))}
                </div>
            ) : skills.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <BoltIcon size={36} color="var(--accent)" />
                        </div>
                        <div className="empty-title">No skills added yet</div>
                        <div className="empty-description">
                            Click any of the popular skill badges above to add your first skills in one click!
                        </div>
                    </div>
                </div>
            ) : (
                <div className="skill-tags">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="skill-tag"
                            style={{
                                background: "var(--bg-card)",
                                padding: "6px 14px",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                boxShadow: "var(--shadow-xs)",
                            }}
                        >
                            <span>{skill.skill_name}</span>
                            <button
                                className="skill-tag-delete"
                                onClick={() => handleDelete(skill.id, skill.skill_name)}
                                disabled={deletingId === skill.id}
                                aria-label={`Remove ${skill.skill_name}`}
                                title="Remove skill"
                                style={{ marginLeft: 6 }}
                            >
                                <TrashIcon size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Skills;
