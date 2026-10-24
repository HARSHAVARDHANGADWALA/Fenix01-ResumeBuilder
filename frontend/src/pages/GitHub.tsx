import { useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";
import {
    GitBranchIcon,
    SearchIcon,
    ExternalLinkIcon,
    PlusIcon,
    CheckIcon,
    SparklesIcon,
} from "../components/ui/Icons";

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string | null;
    language: string;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    topics: string[];
}

function GitHub() {
    const [username, setUsername] = useState("");
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);
    const [importingId, setImportingId] = useState<number | null>(null);
    const [importedIds, setImportedIds] = useState<Set<number>>(new Set());
    const { addToast } = useToast();

    const fetchRepos = async (userToFetch: string) => {
        if (!userToFetch.trim()) return;
        setLoading(true);
        setError("");
        setRepos([]);
        try {
            const res = await fetch(
                `https://api.github.com/users/${userToFetch.trim()}/repos?sort=updated&per_page=30&type=public`
            );
            if (res.status === 404) {
                setError("GitHub user not found. Check the username and try again.");
                return;
            }
            if (res.status === 403) {
                setError("GitHub API rate limit reached. Try again in a few minutes.");
                return;
            }
            if (!res.ok) {
                setError("GitHub API error. Please try again.");
                return;
            }
            const data: Repo[] = await res.json();
            setRepos(data.filter((r) => !r.name.startsWith(".")));
            setSearched(true);
        } catch {
            setError("Network error. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleImportToProjects = async (repo: Repo) => {
        setImportingId(repo.id);
        const techStack = [repo.language, ...(repo.topics || [])].filter(Boolean).join(", ");
        try {
            await apiRequest("/projects", {
                method: "POST",
                body: JSON.stringify({
                    title: repo.name,
                    description: repo.description || "Public repository and open source software project.",
                    technologies: techStack || "TypeScript, Open Source",
                    github_url: repo.html_url,
                    live_url: repo.homepage || "",
                }),
            });
            setImportedIds((prev) => new Set(prev).add(repo.id));
            addToast(`"${repo.name}" imported into your Projects!`, "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to import project", "error");
        } finally {
            setImportingId(null);
        }
    };

    const langs = [...new Set(repos.map((r) => r.language).filter(Boolean))];

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">GitHub Repository Sync</h1>
                        <p className="page-description">
                            Fetch your public repositories and import them into your Fenix project showcase in 1 click.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Box & Quick Preset Profiles */}
            <div className="card card-padded" style={{ marginBottom: 20 }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchRepos(username);
                    }}
                    style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}
                >
                    <div className="form-group" style={{ flex: 1, minWidth: 220 }}>
                        <label className="form-label" htmlFor="gh-username">
                            GitHub Username
                        </label>
                        <input
                            id="gh-username"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your GitHub handle (e.g. torvalds, vercel, shadcn)…"
                        />
                    </div>
                    <div style={{ alignSelf: "flex-end" }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !username.trim()}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" /> Fetching Repos…
                                </>
                            ) : (
                                <>
                                    <SearchIcon size={16} /> Fetch Repositories
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Popular sample handles for instant testing */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <SparklesIcon size={13} color="var(--accent)" /> Quick demo handles:
                    </span>
                    {["shadcn", "facebook", "vercel"].map((handle) => (
                        <button
                            key={handle}
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ height: 26, fontSize: "0.75rem", padding: "0 8px" }}
                            onClick={() => {
                                setUsername(handle);
                                fetchRepos(handle);
                            }}
                        >
                            @{handle}
                        </button>
                    ))}
                </div>

                {error && <div className="error-message" style={{ marginTop: 14 }}>{error}</div>}
            </div>

            {/* Repositories List with 1-Click Import Buttons */}
            {repos.length > 0 && (
                <>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <span className="badge badge-accent">{repos.length} Repositories Found</span>
                            {langs.slice(0, 5).map((l) => (
                                <span key={l} className="badge badge-default">{l}</span>
                            ))}
                        </div>
                        <span className="text-muted text-xs">
                            Click "Import to Projects" to add any repo directly to your database
                        </span>
                    </div>

                    <div className="data-list">
                        {repos.map((repo) => {
                            const isImported = importedIds.has(repo.id);
                            const isImporting = importingId === repo.id;

                            return (
                                <div key={repo.id} className="data-item">
                                    <div className="data-item-body">
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <GitBranchIcon size={16} color="var(--accent)" />
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="data-item-title"
                                                style={{ color: "var(--text-link)", display: "inline-flex", alignItems: "center", gap: 4 }}
                                            >
                                                {repo.name} <ExternalLinkIcon size={13} />
                                            </a>
                                        </div>

                                        <div className="data-item-sub" style={{ marginTop: 4 }}>
                                            {repo.description || "No description provided."}
                                        </div>

                                        <div className="data-item-meta" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                                            {repo.language && (
                                                <span className="badge badge-accent">{repo.language}</span>
                                            )}
                                            {repo.stargazers_count > 0 && (
                                                <span style={{ color: "var(--warning-text)" }}>★ {repo.stargazers_count}</span>
                                            )}
                                            {repo.forks_count > 0 && (
                                                <span>⑂ {repo.forks_count}</span>
                                            )}
                                            <span style={{ color: "var(--text-muted)" }}>
                                                Updated {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                            </span>
                                        </div>

                                        {repo.topics?.length > 0 && (
                                            <div className="skill-tags" style={{ marginTop: 8 }}>
                                                {repo.topics.slice(0, 6).map((t) => (
                                                    <span key={t} className="badge badge-default" style={{ fontSize: "0.6875rem" }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="data-item-actions">
                                        <button
                                            className={`btn btn-sm ${isImported ? "btn-secondary" : "btn-primary"}`}
                                            onClick={() => !isImported && handleImportToProjects(repo)}
                                            disabled={isImported || isImporting}
                                        >
                                            {isImporting ? (
                                                <>
                                                    <span className="spinner" /> Importing…
                                                </>
                                            ) : isImported ? (
                                                <>
                                                    <CheckIcon size={14} color="var(--success)" /> Imported
                                                </>
                                            ) : (
                                                <>
                                                    <PlusIcon size={14} /> Import to Projects
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {searched && repos.length === 0 && !error && (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <GitBranchIcon size={36} color="var(--text-muted)" />
                        </div>
                        <div className="empty-title">No public repositories found</div>
                        <div className="empty-description">
                            Try searching for another username or select one of the quick demo handles above.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GitHub;
