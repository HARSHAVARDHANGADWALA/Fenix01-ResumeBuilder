import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";

interface ExperienceRecord {
    id: number;
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string;
}

const emptyForm = {
    job_title: "", company: "", location: "", start_date: "", end_date: "", is_current: false, description: "",
};

function Experience() {
    const [records, setRecords] = useState<ExperienceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        apiRequest("/experience")
            .then((d) => setRecords(d.experience))
            .catch(() => addToast("Failed to load experience", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.job_title.trim() || !form.company.trim()) {
            addToast("Job title and company are required", "warning");
            return;
        }
        setSaving(true);
        try {
            const data = await apiRequest("/experience", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setRecords((prev) => [data.experience, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
            addToast("Experience added", "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to add experience", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await apiRequest(`/experience/${id}`, { method: "DELETE" });
            setRecords((prev) => prev.filter((r) => r.id !== id));
            addToast("Experience removed", "success");
        } catch {
            addToast("Failed to remove experience", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const fmt = (date: string) => date ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Experience</h1>
                        <p className="page-description">Your work history and professional positions.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
                        {showForm ? "Cancel" : "+ Add Experience"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header"><div style={{ fontWeight: 600 }}>Add Experience</div></div>
                    <form onSubmit={handleAdd}>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label required" htmlFor="job_title">Job Title</label>
                                    <input id="job_title" name="job_title" type="text" className="form-input"
                                        value={form.job_title} onChange={handleChange} placeholder="e.g. Software Engineer" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required" htmlFor="company">Company</label>
                                    <input id="company" name="company" type="text" className="form-input"
                                        value={form.company} onChange={handleChange} placeholder="e.g. Acme Corp" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="exp-location">Location</label>
                                <input id="exp-location" name="location" type="text" className="form-input"
                                    value={form.location} onChange={handleChange} placeholder="e.g. New York, NY or Remote" />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="exp-start">Start Date</label>
                                    <input id="exp-start" name="start_date" type="date" className="form-input"
                                        value={form.start_date} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="exp-end">End Date</label>
                                    <input id="exp-end" name="end_date" type="date" className="form-input"
                                        value={form.end_date} onChange={handleChange} disabled={form.is_current} />
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <input id="is_current" name="is_current" type="checkbox"
                                    checked={form.is_current}
                                    onChange={handleChange}
                                    style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                                <label htmlFor="is_current" className="form-label" style={{ marginBottom: 0, cursor: "pointer" }}>
                                    I currently work here
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="exp-desc">Description</label>
                                <textarea id="exp-desc" name="description" className="form-textarea"
                                    value={form.description} onChange={handleChange} rows={3}
                                    placeholder="Key responsibilities and achievements…" />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <><span className="spinner" />Saving…</> : "Add Experience"}
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="data-list">
                    {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton skeleton-card" />)}
                </div>
            ) : records.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">💼</div>
                        <div className="empty-title">No work experience yet</div>
                        <div className="empty-description">Add your roles and internships to build out your career timeline.</div>
                        <button className="btn btn-primary btn-sm mt-4" onClick={() => setShowForm(true)}>+ Add Experience</button>
                    </div>
                </div>
            ) : (
                <div className="data-list">
                    {records.map((r) => (
                        <div key={r.id} className="data-item">
                            <div className="data-item-body">
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div className="data-item-title">{r.job_title}</div>
                                    {r.is_current && <span className="badge badge-success">Current</span>}
                                </div>
                                <div className="data-item-sub">{r.company}{r.location ? ` · ${r.location}` : ""}</div>
                                <div className="data-item-meta">
                                    {fmt(r.start_date)}{r.end_date || r.is_current ? ` – ${r.is_current ? "Present" : fmt(r.end_date)}` : ""}
                                </div>
                                {r.description && <p className="text-sm text-secondary mt-2">{r.description}</p>}
                            </div>
                            <div className="data-item-actions">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}>
                                    {deletingId === r.id ? "…" : "Remove"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Experience;
