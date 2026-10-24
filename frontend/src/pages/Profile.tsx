import { useEffect, useState } from "react";
import apiRequest from "../services/api";
import { useToast } from "../context/ToastContext";

interface ProfileData {
    phone: string;
    location: string;
    headline: string;
    bio: string;
    linkedin_url: string;
    portfolio_url: string;
}

const empty: ProfileData = {
    phone: "", location: "", headline: "", bio: "", linkedin_url: "", portfolio_url: "",
};

function Profile() {
    const [profile, setProfile] = useState<ProfileData>(empty);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        apiRequest("/profile")
            .then((data) => setProfile(data.profile || empty))
            .catch(() => setProfile(empty))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = await apiRequest("/profile", {
                method: "POST",
                body: JSON.stringify(profile),
            });
            setProfile(data.profile);
            addToast("Profile saved successfully", "success");
        } catch (err) {
            addToast(err instanceof Error ? err.message : "Failed to save profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <div className="skeleton skeleton-title" style={{ width: 120 }} />
                    <div className="skeleton skeleton-text mt-2" style={{ width: 260 }} />
                </div>
                <div className="card card-padded" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                            <div className="skeleton skeleton-text" style={{ width: 80, marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 38, borderRadius: 8 }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Profile</h1>
                        <p className="page-description">Your professional information shown on your resume and career profile.</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Professional Details</div>
                </div>
                <form onSubmit={handleSave}>
                    <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="headline">Professional Headline</label>
                                <input id="headline" name="headline" type="text" className="form-input"
                                    value={profile.headline}
                                    onChange={handleChange}
                                    placeholder="e.g. Full Stack Developer" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="location">Location</label>
                                <input id="location" name="location" type="text" className="form-input"
                                    value={profile.location}
                                    onChange={handleChange}
                                    placeholder="e.g. San Francisco, CA" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="bio">Bio</label>
                            <textarea id="bio" name="bio" className="form-textarea"
                                value={profile.bio}
                                onChange={handleChange}
                                rows={4}
                                placeholder="A short professional summary about yourself..." />
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label" htmlFor="phone">Phone</label>
                                <input id="phone" name="phone" type="tel" className="form-input"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="linkedin_url">LinkedIn URL</label>
                                <input id="linkedin_url" name="linkedin_url" type="url" className="form-input"
                                    value={profile.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/yourprofile" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="portfolio_url">Portfolio / Website URL</label>
                            <input id="portfolio_url" name="portfolio_url" type="url" className="form-input"
                                value={profile.portfolio_url}
                                onChange={handleChange}
                                placeholder="https://yourwebsite.com" />
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner" />Saving…</> : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;