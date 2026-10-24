import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import {
    CodeIcon,
    PlusIcon,
    TrashIcon,
    ExternalLinkIcon,
    SparklesIcon,
} from "../components/ui/Icons";

interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string;
    github_url: string;
    live_url: string;
    start_date: string;
    end_date: string;
}

const TEMPLATES = [
    {
        name: "Full-Stack SaaS Platform",
        data: {
            title: "Chronos — Real-Time Collaborative Workspace",
            description: "Engineered a high-performance workspace tool with real-time markdown synchronization, optimistic updates, and Postgres full-text search.",
            technologies: "React, TypeScript, Node.js, PostgreSQL, Tailwind CSS",
            github_url: "https://github.com/example/chronos-app",
            live_url: "https://chronos-demo.vercel.app",
        }
    },
    {
        name: "Developer CLI / Microservice",
        data: {
            title: "KubeGate — API Gateway & Rate Limiter",
            description: "High-throughput reverse proxy handling JWT authentication and distributed rate-limiting with Redis sliding window counters.",
            technologies: "Go, Docker, Redis, Kubernetes, Prometheus",
            github_url: "https://github.com/example/kube-gate",
            live_url: "https://kubegate.dev",
        }
    },
    {
        name: "Design Token Component Library",
        data: {
            title: "Aura UI — Headless Design System",
            description: "Accessible, theme-aware component library adhering to WCAG 2.1 AA guidelines with keyboard navigation primitives.",
            technologies: "React, TypeScript, Radix Primitives, CSS Tokens",
            github_url: "https://github.com/example/aura-ui",
            live_url: "https://aura-ui.dev",
        }
    }
];

const emptyForm = {
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
    start_date: "",
    end_date: "",
};

function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        apiRequest("/projects")
            .then((d) => setProjects(d.projects))
            .catch(() => addToast("Failed to load projects", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
        setForm((prev) => ({
            ...prev,
            ...tmpl.data,
        }));
        setShowForm(true);
        addToast(`Filled form with "${tmpl.name}" template`, "info");
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            addToast("Title and description are required", "warning");
            return;
        }
        setSaving(true);
        try {
            const data = await apiRequest("/projects", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setProjects((prev) => [data.project, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
            addToast("Project artifact created successfully", "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to add project", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await apiRequest(`/projects/${id}`, { method: "DELETE" });
            setProjects((prev) => prev.filter((p) => p.id !== id));
            addToast("Project removed", "success");
        } catch {
            addToast("Failed to remove project", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const techList = (tech: string) =>
        tech ? tech.split(",").map((t) => t.trim()).filter(Boolean) : [];

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Projects & Technical Evidence</h1>
                        <p className="page-description">
                            Showcase real software artifacts that prove what you can build.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm((v) => !v)}
                        >
                            {showForm ? "Close Form" : <><PlusIcon size={16} /> Add Project</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Template Presets Bar */}
            <div
                className="card card-padded"
                style={{
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 12,
                    background: "var(--bg-card-subtle)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SparklesIcon size={16} color="var(--accent)" />
                    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                        Quick Project Presets:
                    </span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {TEMPLATES.map((tmpl) => (
                        <button
                            key={tmpl.name}
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleApplyTemplate(tmpl)}
                        >
                            + {tmpl.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Create Project Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <div style={{ fontWeight: 600 }}>Project Details</div>
                    </div>
                    <form onSubmit={handleAdd}>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label required" htmlFor="proj-title">
                                    Project Name
                                </label>
                                <input
                                    id="proj-title"
                                    name="title"
                                    type="text"
                                    className="form-input"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Distributed Telemetry Platform"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label required" htmlFor="proj-desc">
                                    Description & Impact
                                </label>
                                <textarea
                                    id="proj-desc"
                                    name="description"
                                    className="form-textarea"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="What does it do? Highlight any metrics or architecture choices…"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="proj-tech">
                                    Technologies Used
                                </label>
                                <input
                                    id="proj-tech"
                                    name="technologies"
                                    type="text"
                                    className="form-input"
                                    value={form.technologies}
                                    onChange={handleChange}
                                    placeholder="React, TypeScript, Node.js, PostgreSQL (comma-separated)"
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-github">
                                        GitHub Repository URL
                                    </label>
                                    <input
                                        id="proj-github"
                                        name="github_url"
                                        type="url"
                                        className="form-input"
                                        value={form.github_url}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-live">
                                        Live Deployment URL
                                    </label>
                                    <input
                                        id="proj-live"
                                        name="live_url"
                                        type="url"
                                        className="form-input"
                                        value={form.live_url}
                                        onChange={handleChange}
                                        placeholder="https://demo.vercel.app"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <><span className="spinner" /> Saving…</> : "Save Project"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowForm(false);
                                    setForm(emptyForm);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects List */}
            {loading ? (
                <div className="data-list">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton skeleton-card" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <CodeIcon size={40} color="var(--accent)" />
                        </div>
                        <div className="empty-title">No projects recorded yet</div>
                        <div className="empty-description">
                            Use the quick presets above or import your public repositories via the GitHub sync page!
                        </div>
                    </div>
                </div>
            ) : (
                <div className="data-list">
                    {projects.map((p) => (
                        <div key={p.id} className="data-item">
                            <div className="data-item-body">
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <CodeIcon size={16} color="var(--accent)" />
                                    <span className="data-item-title">{p.title}</span>
                                </div>

                                <div className="data-item-sub" style={{ marginTop: 4 }}>
                                    {p.description}
                                </div>

                                {techList(p.technologies).length > 0 && (
                                    <div className="skill-tags" style={{ marginTop: 10 }}>
                                        {techList(p.technologies).map((t) => (
                                            <span key={t} className="badge badge-accent" style={{ fontSize: "0.75rem" }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="data-item-meta" style={{ marginTop: 8, display: "flex", gap: 14 }}>
                                    {p.github_url && (
                                        <a
                                            href={p.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 4 }}
                                        >
                                            GitHub Source <ExternalLinkIcon size={12} />
                                        </a>
                                    )}
                                    {p.live_url && (
                                        <a
                                            href={p.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 4 }}
                                        >
                                            Live Demo <ExternalLinkIcon size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="data-item-actions">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(p.id)}
                                    disabled={deletingId === p.id}
                                >
                                    <TrashIcon size={13} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Projects;
