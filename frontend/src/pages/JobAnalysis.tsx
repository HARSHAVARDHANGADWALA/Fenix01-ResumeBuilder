import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    SearchIcon,
    SparklesIcon,
    CheckIcon,
} from "../components/ui/Icons";

interface Skill { id: number; skill_name: string; }

const SAMPLE_JDS: Record<string, { company: string; title: string; text: string }> = {
    stripe: {
        company: "Stripe",
        title: "Senior Full-Stack Engineer",
        text: `We are looking for a Senior Full-Stack Engineer to join our Developer Infrastructure team.

Key Requirements:
- 4+ years of professional software engineering experience with TypeScript, React, and Node.js.
- Strong understanding of REST APIs, GraphQL, and microservices architecture.
- Experience with relational databases like PostgreSQL and in-memory caches like Redis.
- Familiarity with containerization using Docker, Kubernetes, and cloud providers such as AWS.
- Background in writing clean, well-tested code using Jest and CI/CD pipelines.
- Excellent communication and collaboration skills in a high-growth environment.`
    },
    vercel: {
        company: "Vercel",
        title: "Staff Frontend Architect",
        text: `Vercel is seeking a Staff Frontend Architect to craft the next generation of web developer workflows.

What we are looking for:
- Exceptional mastery of React, Next.js, and modern TypeScript.
- Deep expertise in Design Systems, accessible HTML, CSS Architecture, and Tailwind CSS.
- Proven track record of optimizing Core Web Vitals, page rendering performance, and bundle size.
- Experience with Figma design handoffs and design token tooling.
- Experience writing unit and integration tests with Jest or Cypress.
- Passion for developer experience and open-source ecosystems.`
    },
    openai: {
        company: "OpenAI",
        title: "AI Platform & Systems Engineer",
        text: `We are seeking an AI Platform Engineer to build scalable infrastructure supporting research and generative model deployment.

Qualifications:
- Solid background in Python, Go, and distributed systems.
- Experience with Docker, Kubernetes, Linux internals, and high-performance cloud clusters on AWS or GCP.
- Knowledge of relational databases (PostgreSQL) and data frameworks (Pandas, NumPy).
- Understanding of monitoring tools like Prometheus, Grafana, and CI/CD automation with Git.
- Curiosity about machine learning, LLMs, and scalable inference APIs.`
    }
};

function normalize(s: string) { return s.toLowerCase().replace(/[^a-z0-9]/g, ""); }

function extractKeywords(jd: string): string[] {
    const techTerms = [
        "javascript", "typescript", "python", "java", "go", "rust", "c++", "c#",
        "react", "vue", "angular", "nextjs", "next.js", "html", "html5", "css", "css3", "tailwind",
        "nodejs", "node.js", "express", "django", "flask", "fastapi", "spring",
        "postgresql", "mysql", "mongodb", "redis", "sqlite", "graphql", "rest", "rest apis",
        "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ci/cd", "github actions",
        "git", "linux", "bash", "prometheus", "grafana",
        "pandas", "numpy", "machine learning", "llms", "testing", "jest", "cypress",
        "figma", "design systems", "microservices"
    ];

    const words = jd.toLowerCase().split(/[\s,.;:()/\-]+/);
    const found = new Set<string>();

    techTerms.forEach((term) => {
        const normalized = term.replace(/[^a-z0-9]/g, "");
        if (
            words.some((w) => w === normalized || (w.includes(normalized) && normalized.length > 2)) ||
            jd.toLowerCase().includes(term.toLowerCase())
        ) {
            found.add(term);
        }
    });

    return Array.from(found);
}

function JobAnalysis() {
    const { user } = useAuth();
    const [jd, setJd] = useState("");
    const [skills, setSkills] = useState<Skill[]>([]);
    const [analyzed, setAnalyzed] = useState(false);
    const [matches, setMatches] = useState<string[]>([]);
    const [missing, setMissing] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiRequest("/skills").then((d) => setSkills(d.skills)).catch(() => {});
    }, []);

    const analyze = () => {
        if (!jd.trim()) return;
        setLoading(true);
        setTimeout(() => {
            const keywords = extractKeywords(jd);
            const userNorm = skills.map((s) => normalize(s.skill_name));
            const m: string[] = [];
            const miss: string[] = [];

            keywords.forEach((kw) => {
                const kwN = normalize(kw);
                if (userNorm.some((u) => u.includes(kwN) || kwN.includes(u))) {
                    m.push(kw);
                } else {
                    miss.push(kw);
                }
            });

            setMatches(m);
            setMissing(miss);
            setAnalyzed(true);
            setLoading(false);
        }, 350);
    };

    const loadSampleJD = (key: string) => {
        const sample = SAMPLE_JDS[key];
        if (sample) {
            setJd(sample.text);
            setAnalyzed(false);
        }
    };

    const matchPct =
        matches.length + missing.length > 0
            ? Math.round((matches.length / (matches.length + missing.length)) * 100)
            : 0;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Job Description Intelligence</h1>
                        <p className="page-description">
                            Compare your verified skill set against any job listing and generate an instant tailored pitch.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input & Sample Pickers */}
            <div className="card card-padded" style={{ marginBottom: 20 }}>
                {/* 1-Click Sample Pre-fills */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <label className="form-label" htmlFor="jd-input" style={{ marginBottom: 0 }}>
                        Target Job Description
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                            <SparklesIcon size={13} color="var(--accent)" /> Load sample JD:
                        </span>
                        {Object.entries(SAMPLE_JDS).map(([key, val]) => (
                            <button
                                key={key}
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ height: 26, fontSize: "0.75rem", padding: "0 8px" }}
                                onClick={() => loadSampleJD(key)}
                            >
                                {val.company} ({val.title})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <textarea
                        id="jd-input"
                        className="form-textarea"
                        rows={8}
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                        placeholder="Paste any job listing text here, or click one of the sample company buttons above…"
                    />
                </div>

                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        className="btn btn-primary"
                        onClick={analyze}
                        disabled={!jd.trim() || loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" /> Analyzing Keywords…
                            </>
                        ) : (
                            <>
                                <SearchIcon size={16} /> Run Match Analysis
                            </>
                        )}
                    </button>

                    {skills.length === 0 && (
                        <span className="text-muted text-xs">
                            Notice: Add skills or load a demo profile to see your match score!
                        </span>
                    )}
                </div>
            </div>

            {/* Analysis Results */}
            {analyzed && (
                <>
                    {/* Score Bar */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: 14,
                            marginBottom: 20,
                        }}
                    >
                        <div className="card card-padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
                                {matchPct}%
                            </div>
                            <div className="text-muted text-xs" style={{ marginTop: 6 }}>
                                ATS Match Score
                            </div>
                        </div>

                        <div className="card card-padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--success)", lineHeight: 1 }}>
                                {matches.length}
                            </div>
                            <div className="text-muted text-xs" style={{ marginTop: 6 }}>
                                Verified Skill Matches
                            </div>
                        </div>

                        <div className="card card-padded" style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--error)", lineHeight: 1 }}>
                                {missing.length}
                            </div>
                            <div className="text-muted text-xs" style={{ marginTop: 6 }}>
                                Missing Keywords
                            </div>
                        </div>
                    </div>

                    {/* Matched Skills */}
                    {matches.length > 0 && (
                        <div className="card card-padded" style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--success)", marginBottom: 10 }}>
                                <CheckIcon size={16} />
                                Verified Skills You Have ({matches.length})
                            </div>
                            <div className="skill-tags">
                                {matches.map((m) => (
                                    <span key={m} className="badge badge-success" style={{ padding: "4px 10px" }}>
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {missing.length > 0 && (
                        <div className="card card-padded" style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 700, color: "var(--error)", marginBottom: 8 }}>
                                Recommended Keywords to Include ({missing.length})
                            </div>
                            <div className="skill-tags">
                                {missing.map((m) => (
                                    <span key={m} className="badge badge-error" style={{ padding: "4px 10px" }}>
                                        {m}
                                    </span>
                                ))}
                            </div>
                            <p className="text-muted text-xs" style={{ marginTop: 10 }}>
                                These technologies are highlighted in the job requirements. If you have experience with them, add them to your profile.
                            </p>
                        </div>
                    )}

                    {/* Instant Tailored Intro / Pitch Generator */}
                    {matches.length > 0 && (
                        <div
                            className="card card-padded"
                            style={{
                                background: "var(--bg-card-subtle)",
                                border: "1px solid var(--accent-border)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, marginBottom: 8 }}>
                                <SparklesIcon size={16} color="var(--accent)" />
                                Tailored Elevator Pitch / Cover Intro
                            </div>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    lineHeight: 1.6,
                                    color: "var(--text-primary)",
                                    background: "var(--bg-card)",
                                    padding: "14px 16px",
                                    borderRadius: "var(--radius-md)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                "Hi there, I am {user?.name || "a software engineer"} with deep hands-on expertise in{" "}
                                <strong>{matches.slice(0, 4).join(", ")}</strong>
                                {matches.length > 4 ? ` and ${matches[4]}` : ""}. Having delivered high-impact web and backend systems matching your tech stack, I am eager to contribute to your engineering goals."
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default JobAnalysis;
