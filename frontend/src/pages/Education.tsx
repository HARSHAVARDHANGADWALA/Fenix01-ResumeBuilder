import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";

interface EduRecord {
    id: number;
    degree: string;
    institution: string;
    field_of_study: string;
    start_year: number | null;
    end_year: number | null;
    grade: string;
    description: string;
}

const emptyForm = {
    degree: "", institution: "", field_of_study: "", start_year: "", end_year: "", grade: "", description: "",
};

function Education() {
    const [records, setRecords] = useState<EduRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        apiRequest("/education")
            .then((d) => setRecords(d.education))
            .catch(() => addToast("Failed to load education", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.degree.trim() || !form.institution.trim()) {
            addToast("Degree and institution are required", "warning");
            return;
        }
        setSaving(true);
        try {
            const data = await apiRequest("/education", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    start_year: form.start_year ? Number(form.start_year) : null,
                    end_year: form.end_year ? Number(form.end_year) : null,
                }),
            });
            setRecords((prev) => [data.education, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
            addToast("Education added", "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to add education", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await apiRequest(`/education/${id}`, { method: "DELETE" });
            setRecords((prev) => prev.filter((r) => r.id !== id));
            addToast("Education removed", "success");
        } catch {
            addToast("Failed to remove education", "error");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Education</h1>
                        <p className="page-description">Your academic background and qualifications.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
                        {showForm ? "Cancel" : "+ Add Education"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header">
                        <div style={{ fontWeight: 600 }}>Add Education</div>
                    </div>
                    <form onSubmit={handleAdd}>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label required" htmlFor="degree">Degree</label>
                                    <input id="degree" name="degree" type="text" className="form-input"
                                        value={form.degree} onChange={handleChange} placeholder="e.g. B.Sc Computer Science" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required" htmlFor="institution">Institution</label>
                                    <input id="institution" name="institution" type="text" className="form-input"
                                        value={form.institution} onChange={handleChange} placeholder="e.g. MIT" required />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="field_of_study">Field of Study</label>
                                    <input id="field_of_study" name="field_of_study" type="text" className="form-input"
                                        value={form.field_of_study} onChange={handleChange} placeholder="e.g. Software Engineering" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="grade">Grade / GPA</label>
                                    <input id="grade" name="grade" type="text" className="form-input"
                                        value={form.grade} onChange={handleChange} placeholder="e.g. 3.8 / 4.0" />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="start_year">Start Year</label>
                                    <input id="start_year" name="start_year" type="number" className="form-input"
                                        value={form.start_year} onChange={handleChange} placeholder="2019" min="1950" max="2100" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="end_year">End Year</label>
                                    <input id="end_year" name="end_year" type="number" className="form-input"
                                        value={form.end_year} onChange={handleChange} placeholder="2023 (or leave blank if ongoing)" min="1950" max="2100" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="edu-desc">Description</label>
                                <textarea id="edu-desc" name="description" className="form-textarea"
                                    value={form.description} onChange={handleChange} rows={3}
                                    placeholder="Relevant coursework, achievements, activities…" />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <><span className="spinner" />Saving…</> : "Add Education"}
                            </button>
                            <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="data-list">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="skeleton skeleton-card" />
                    ))}
                </div>
            ) : records.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">🎓</div>
                        <div className="empty-title">No education records</div>
                        <div className="empty-description">Add your academic history to complete your profile and resume.</div>
                        <button className="btn btn-primary btn-sm mt-4" onClick={() => setShowForm(true)}>+ Add Education</button>
                    </div>
                </div>
            ) : (
                <div className="data-list">
                    {records.map((r) => (
                        <div key={r.id} className="data-item">
                            <div className="data-item-body">
                                <div className="data-item-title">{r.degree}</div>
                                <div className="data-item-sub">{r.institution}{r.field_of_study ? ` · ${r.field_of_study}` : ""}</div>
                                <div className="data-item-meta">
                                    {[r.start_year, r.end_year].filter(Boolean).join(" – ")}
                                    {r.grade ? ` · ${r.grade}` : ""}
                                </div>
                                {r.description && <p className="text-sm text-secondary mt-2">{r.description}</p>}
                            </div>
                            <div className="data-item-actions">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(r.id)}
                                    disabled={deletingId === r.id}
                                >
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

export default Education;
