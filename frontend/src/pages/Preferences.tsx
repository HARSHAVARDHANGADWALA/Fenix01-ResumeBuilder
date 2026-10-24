import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Preferences() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            <div className="page-header">
                <div className="page-header-top">
                    <div>
                        <h1 className="page-title">Preferences</h1>
                        <p className="page-description">Manage your account settings and application preferences.</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header">
                    <div style={{ fontWeight: 600 }}>Account</div>
                </div>
                <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Name</div>
                            <div className="text-muted text-sm">{user?.name}</div>
                        </div>
                    </div>
                    <div className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Email</div>
                            <div className="text-muted text-sm">{user?.email}</div>
                        </div>
                    </div>
                    <div className="divider" />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Member since</div>
                            <div className="text-muted text-sm">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div style={{ fontWeight: 600 }}>Appearance</div>
                </div>
                <div className="card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Theme</div>
                            <div className="text-muted text-sm">
                                Currently using <strong>{theme}</strong> mode. Your preference is saved automatically.
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? "☀ Switch to Light" : "☾ Switch to Dark"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Preferences;
