import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PERSONAS, populatePersona, type Persona } from "../data/personas";
import {
    BoltIcon,
    CodeIcon,
    AcademicIcon,
    BriefcaseIcon,
    AwardIcon,
    FileTextIcon,
    SearchIcon,
    TargetIcon,
    GitBranchIcon,
    SparklesIcon,
    ChevronRightIcon,
    CheckIcon,
} from "../components/ui/Icons";

interface DashboardData {
    skillsCount: number;
    projectsCount: number;
    educationCount: number;
    experienceCount: number;
    certificationsCount: number;
}

function StatCard({
    icon,
    label,
    value,
    to,
}: {
    icon: React.ReactNode;
    label: string;
    value: number;
    to: string;
}) {
    return (
        <Link to={to} className="stat-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="stat-icon" style={{ width: 34, height: 34, borderRadius: 8 }}>
                    {icon}
                </div>
                <ChevronRightIcon size={14} color="var(--text-muted)" />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </Link>
    );
}

function SkeletonStatCard() {
    return (
        <div className="stat-card" style={{ gap: 10 }}>
            <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 8 }} />
            <div className="skeleton skeleton-title" style={{ width: 44 }} />
            <div className="skeleton skeleton-text" style={{ width: 70 }} />
        </div>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [populatingId, setPopulatingId] = useState<string | null>(null);
    const [populatingMsg, setPopulatingMsg] = useState("");
    const [showPersonaDrawer, setShowPersonaDrawer] = useState(false);

    const loadDashboard = () => {
        apiRequest("/dashboard")
            .then(setData)
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleLoadPersona = async (persona: Persona) => {
        setPopulatingId(persona.id);
        try {
            await populatePersona(persona, (msg) => setPopulatingMsg(msg));
            addToast(`Successfully loaded ${persona.title} persona!`, "success");
            setShowPersonaDrawer(false);
            loadDashboard();
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to load persona", "error");
        } finally {
            setPopulatingId(null);
            setPopulatingMsg("");
        }
    };

    const firstName = user?.name?.split(" ")[0] || "there";

    // Readiness calculation
    const skillsCount = data?.skillsCount ?? 0;
    const projectsCount = data?.projectsCount ?? 0;
    const experienceCount = data?.experienceCount ?? 0;
    const educationCount = data?.educationCount ?? 0;
    const certificationsCount = data?.certificationsCount ?? 0;

    let readinessScore = 15; // base score for account
    if (skillsCount >= 3) readinessScore += 25;
    else if (skillsCount > 0) readinessScore += 10;

    if (projectsCount >= 2) readinessScore += 25;
    else if (projectsCount > 0) readinessScore += 12;

    if (experienceCount >= 1) readinessScore += 20;
    if (educationCount >= 1) readinessScore += 10;
    if (certificationsCount >= 1) readinessScore += 5;

    readinessScore = Math.min(readinessScore, 100);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <h1 className="page-title">
                                Welcome back, {firstName}
                            </h1>
                            <span
                                style={{
                                    fontSize: "0.75rem",
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    background: "var(--accent-light)",
                                    color: "var(--accent-text)",
                                    fontWeight: 600,
                                    border: "1px solid var(--accent-border)",
                                }}
                            >
                                Pro Edition
                            </span>
                        </div>
                        <p className="page-description">
                            Here is an overview of your career profile, skill readiness, and portfolio evidence.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowPersonaDrawer((v) => !v)}
                        >
                            <SparklesIcon size={15} /> 1-Click Demo Profile
                        </button>
                        <Link to="/resume" className="btn btn-primary">
                            <FileTextIcon size={15} /> Build Resume
                        </Link>
                    </div>
                </div>
            </div>

            {/* 1-Click Persona Drawer / Banner */}
            {showPersonaDrawer && (
                <div
                    className="card card-padded"
                    style={{
                        marginBottom: 24,
                        background: "linear-gradient(135deg, var(--bg-card) 0%, var(--accent-light) 100%)",
                        borderColor: "var(--accent-border)",
                        boxShadow: "var(--accent-glow)",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "1rem" }}>
                                <SparklesIcon size={18} color="var(--accent)" />
                                Instant Demo Persona Loader
                            </div>
                            <p className="text-secondary text-sm" style={{ marginTop: 2 }}>
                                Don't want to fill out manual forms? Choose a persona below to instantly populate your profile with realistic skills, projects, and career history in 1 click.
                            </p>
                        </div>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowPersonaDrawer(false)}
                            style={{ padding: "4px 8px" }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                        {PERSONAS.map((p) => {
                            const isSelected = populatingId === p.id;
                            return (
                                <div
                                    key={p.id}
                                    style={{
                                        background: "var(--bg-card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-md)",
                                        padding: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        gap: 12,
                                    }}
                                >
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{p.title}</span>
                                            <span className="badge badge-accent" style={{ fontSize: "0.6875rem" }}>{p.badge}</span>
                                        </div>
                                        <p className="text-muted text-xs" style={{ lineHeight: 1.5 }}>
                                            {p.skills.slice(0, 5).join(", ")} + {p.skills.length - 5} more · {p.projects.length} Projects · {p.experience.length} Roles
                                        </p>
                                    </div>

                                    <button
                                        className="btn btn-primary btn-sm w-full"
                                        onClick={() => handleLoadPersona(p)}
                                        disabled={!!populatingId}
                                    >
                                        {isSelected ? (
                                            <>
                                                <span className="spinner" />
                                                {populatingMsg || "Populating…"}
                                            </>
                                        ) : (
                                            "Load this Persona"
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Career Readiness & Health Score Card */}
            <div
                className="card card-padded"
                style={{
                    marginBottom: 24,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 24,
                    alignItems: "center",
                }}
            >
                {/* Circular readiness dial */}
                <div style={{ position: "relative", width: 104, height: 104, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="104" height="104" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="transparent"
                            stroke="var(--border)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="transparent"
                            stroke="var(--accent)"
                            strokeWidth="8"
                            strokeDasharray={264}
                            strokeDashoffset={264 - (264 * readinessScore) / 100}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 800ms ease" }}
                        />
                    </svg>
                    <div style={{ position: "absolute", textAlign: "center" }}>
                        <div style={{ fontSize: "1.375rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em" }}>
                            {readinessScore}%
                        </div>
                        <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>
                            Readiness
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontWeight: 700, fontSize: "1.0625rem" }}>
                            {readinessScore >= 80 ? "Senior Portfolio Status" : readinessScore >= 50 ? "Intermediate Profile" : "Getting Started"}
                        </div>
                        <span className="badge badge-success">
                            ● Active Optimization
                        </span>
                    </div>
                    <p className="text-secondary text-sm" style={{ marginBottom: 12 }}>
                        {readinessScore >= 80
                            ? "Your profile has robust technical evidence, projects, and work history ready for recruiters and automated ATS systems."
                            : "Add 2+ projects and at least 5 skills to unlock complete ATS-friendly resume export and skill gap matching."}
                    </p>

                    {/* Quick checklist indicators */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: "0.8125rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: skillsCount > 0 ? "var(--success)" : "var(--text-muted)" }}>
                            <CheckIcon size={14} /> Skills ({skillsCount})
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: projectsCount > 0 ? "var(--success)" : "var(--text-muted)" }}>
                            <CheckIcon size={14} /> Projects ({projectsCount})
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: experienceCount > 0 ? "var(--success)" : "var(--text-muted)" }}>
                            <CheckIcon size={14} /> Experience ({experienceCount})
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: educationCount > 0 ? "var(--success)" : "var(--text-muted)" }}>
                            <CheckIcon size={14} /> Education ({educationCount})
                        </span>
                    </div>
                </div>
            </div>

            {/* Real Stats Grid */}
            <div className="stats-grid">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard icon={<BoltIcon size={18} color="var(--accent)" />} label="Verified Skills" value={skillsCount} to="/skills" />
                        <StatCard icon={<CodeIcon size={18} color="var(--accent)" />} label="Project Artifacts" value={projectsCount} to="/projects" />
                        <StatCard icon={<BriefcaseIcon size={18} color="var(--accent)" />} label="Work Roles" value={experienceCount} to="/experience" />
                        <StatCard icon={<AcademicIcon size={18} color="var(--accent)" />} label="Education Records" value={educationCount} to="/education" />
                        <StatCard icon={<AwardIcon size={18} color="var(--accent)" />} label="Certifications" value={certificationsCount} to="/certifications" />
                    </>
                )}
            </div>

            {/* Quick Actions Bar */}
            <div className="section-gap">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                        Fast Actions & Tools
                    </h2>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Zero friction shortcuts</span>
                </div>

                <div className="quick-actions-grid">
                    <Link to="/resume" className="quick-action">
                        <div className="stat-icon" style={{ width: 28, height: 28 }}>
                            <FileTextIcon size={16} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Resume Engine</div>
                            <div className="text-muted text-xs">Print or export to PDF</div>
                        </div>
                    </Link>

                    <Link to="/skills" className="quick-action">
                        <div className="stat-icon" style={{ width: 28, height: 28 }}>
                            <BoltIcon size={16} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Skill Catalog</div>
                            <div className="text-muted text-xs">1-click popular badges</div>
                        </div>
                    </Link>

                    <Link to="/github" className="quick-action">
                        <div className="stat-icon" style={{ width: 28, height: 28 }}>
                            <GitBranchIcon size={16} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>GitHub Sync</div>
                            <div className="text-muted text-xs">Import repos as projects</div>
                        </div>
                    </Link>

                    <Link to="/job-analysis" className="quick-action">
                        <div className="stat-icon" style={{ width: 28, height: 28 }}>
                            <SearchIcon size={16} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Job Matcher</div>
                            <div className="text-muted text-xs">Test against Stripe/Vercel JDs</div>
                        </div>
                    </Link>

                    <Link to="/skill-gaps" className="quick-action">
                        <div className="stat-icon" style={{ width: 28, height: 28 }}>
                            <TargetIcon size={16} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>Gap Analysis</div>
                            <div className="text-muted text-xs">Curated benchmarks</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;