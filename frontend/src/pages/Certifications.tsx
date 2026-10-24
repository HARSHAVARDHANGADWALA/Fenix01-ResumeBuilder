import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";

interface Certification {
    id: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    credential_id: string;
    credential_url: string;
}

const emptyForm = {
    name: "", issuing_organization: "", issue_date: "", credential_id: "", credential_url: "",
};

function Certifications() {
    const [certs, setCerts] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        apiRequest("/certifications")
            .then((d) => setCerts(d.certifications))
            .catch(() => addToast("Failed to load certifications", "error"))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { addToast("Certification name is required", "warning"); return; }
        setSaving(true);
        try {
            const data = await apiRequest("/certifications", {
                method: "POST",
                body: JSON.stringify(form),
            });
            setCerts((prev) => [data.certification, ...prev]);
            setForm(emptyForm);
            setShowForm(false);
            addToast("Certification added", "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to add certification", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await apiRequest(`/certifications/${id}`, { method: "DELETE" });
            setCerts((prev) => prev.filter((c) => c.id !== id));
            addToast("Certification removed", "success");
        } catch {
            addToast("Failed to remove certification", "error");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Certifications</h1>
                        <p className="page-description">Professional certifications and credentials you've earned.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
                        {showForm ? "Cancel" : "+ Add Certification"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header"><div style={{ fontWeight: 600 }}>Add Certification</div></div>
                    <form onSubmit={handleAdd}>
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label required" htmlFor="cert-name">Certification Name</label>
                                <input id="cert-name" name="name" type="text" className="form-input"
                                    value={form.name} onChange={handleChange} placeholder="e.g. AWS Certified Developer" required />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="cert-org">Issuing Organization</label>
                                    <input id="cert-org" name="issuing_organization" type="text" className="form-input"
                                        value={form.issuing_organization} onChange={handleChange} placeholder="e.g. Amazon Web Services" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="cert-date">Issue Date</label>
                                    <input id="cert-date" name="issue_date" type="date" className="form-input"
                                        value={form.issue_date} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="cert-id">Credential ID</label>
                                    <input id="cert-id" name="credential_id" type="text" className="form-input"
                                        value={form.credential_id} onChange={handleChange} placeholder="e.g. ABC123XYZ" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="cert-url">Credential URL</label>
                                    <input id="cert-url" name="credential_url" type="url" className="form-input"
                                        value={form.credential_url} onChange={handleChange} placeholder="https://verify.example.com/cert" />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <><span className="spinner" />Saving…</> : "Add Certification"}
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
            ) : certs.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-icon">✦</div>
                        <div className="empty-title">No certifications yet</div>
                        <div className="empty-description">Add your professional certificates and credentials to strengthen your profile.</div>
                        <button className="btn btn-primary btn-sm mt-4" onClick={() => setShowForm(true)}>+ Add Certification</button>
                    </div>
                </div>
            ) : (
                <div className="data-list">
                    {certs.map((c) => (
                        <div key={c.id} className="data-item">
                            <div className="data-item-body">
                                <div className="data-item-title">{c.name}</div>
                                {c.issuing_organization && <div className="data-item-sub">{c.issuing_organization}</div>}
                                <div className="data-item-meta">
                                    {c.issue_date ? `Issued ${new Date(c.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : ""}
                                    {c.credential_id ? ` · ID: ${c.credential_id}` : ""}
                                </div>
                                {c.credential_url && (
                                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: "0.8125rem", color: "var(--text-link)", marginTop: 4, display: "inline-block" }}>
                                        Verify credential ↗
                                    </a>
                                )}
                            </div>
                            <div className="data-item-actions">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}>
                                    {deletingId === c.id ? "…" : "Remove"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Certifications;
