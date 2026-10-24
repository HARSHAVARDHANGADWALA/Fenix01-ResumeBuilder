import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
    OverviewIcon,
    UserIcon,
    BoltIcon,
    CodeIcon,
    AcademicIcon,
    BriefcaseIcon,
    AwardIcon,
    FileTextIcon,
    SearchIcon,
    TargetIcon,
    CompassIcon,
    GitBranchIcon,
    SettingsIcon,
    SparklesIcon,
} from "./ui/Icons";

function SunIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
}
function MoonIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
function MenuIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function XIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

const nav = [
    {
        group: "Workspace",
        items: [
            { to: "/dashboard",      label: "Overview",        icon: <OverviewIcon size={16} /> },
            { to: "/profile",        label: "Profile",         icon: <UserIcon size={16} /> },
            { to: "/skills",         label: "Skills",          icon: <BoltIcon size={16} /> },
            { to: "/projects",       label: "Projects",        icon: <CodeIcon size={16} /> },
            { to: "/education",      label: "Education",       icon: <AcademicIcon size={16} /> },
            { to: "/experience",     label: "Experience",      icon: <BriefcaseIcon size={16} /> },
            { to: "/certifications", label: "Certifications",  icon: <AwardIcon size={16} /> },
        ],
    },
    {
        group: "Career Intelligence",
        items: [
            { to: "/resume",         label: "Resume Builder",  icon: <FileTextIcon size={16} />, badge: "PDF" },
            { to: "/job-analysis",   label: "Job Analysis",    icon: <SearchIcon size={16} /> },
            { to: "/skill-gaps",     label: "Skill Gaps",      icon: <TargetIcon size={16} /> },
            { to: "/career-roles",   label: "Career Roles",    icon: <CompassIcon size={16} /> },
            { to: "/github",         label: "GitHub Sync",     icon: <GitBranchIcon size={16} />, badge: "Sync" },
        ],
    },
    {
        group: "Configuration",
        items: [
            { to: "/preferences",    label: "Preferences",     icon: <SettingsIcon size={16} /> },
        ],
    },
];

function SidebarNav({ onClose }: { onClose: () => void }) {
    return (
        <>
            <div className="sidebar-logo">
                <div className="sidebar-logo-mark">
                    <SparklesIcon size={16} color="white" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="sidebar-logo-text">Fenix</span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        Career Cloud
                    </span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {nav.map((section) => (
                    <div key={section.group} className="sidebar-group">
                        <div className="sidebar-group-label">{section.group}</div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    "sidebar-link" + (isActive ? " active" : "")
                                }
                                onClick={onClose}
                            >
                                <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {item.icon}
                                </span>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge && (
                                    <span
                                        style={{
                                            fontSize: "0.6875rem",
                                            fontWeight: 600,
                                            padding: "1px 6px",
                                            borderRadius: "999px",
                                            background: "var(--accent-light)",
                                            color: "var(--accent-text)",
                                            border: "1px solid var(--accent-border)",
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </>
    );
}

function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const closeSidebar = () => setSidebarOpen(false);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (e.key === "Escape") setSidebarOpen(false);
        }
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    return (
        <div className="app-shell">
            {/* Desktop Sidebar */}
            <aside className="sidebar" aria-label="Main navigation">
                <SidebarNav onClose={() => {}} />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay open"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`sidebar${sidebarOpen ? " open" : ""}`}
                style={{ display: "none" }}
                aria-label="Mobile navigation"
                aria-hidden={!sidebarOpen}
            >
                <SidebarNav onClose={closeSidebar} />
            </aside>

            <style>{`
                @media (max-width: 768px) {
                    .app-shell > aside:first-of-type { display: none !important; }
                    .app-shell > aside:last-of-type { display: flex !important; flex-direction: column; }
                }
            `}</style>

            <div className="main-wrapper">
                {/* Topbar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setSidebarOpen((v) => !v)}
                            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
                            aria-expanded={sidebarOpen}
                        >
                            {sidebarOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Workspace /</span>
                            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                {user?.name ? `${user.name}'s Portfolio` : "Developer Hub"}
                            </span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        {/* Live indicator badge */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "3px 10px",
                                borderRadius: "999px",
                                background: "var(--bg-card-subtle)",
                                border: "1px solid var(--border)",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                color: "var(--text-secondary)",
                            }}
                        >
                            <span
                                style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: "#10b981",
                                    boxShadow: "0 0 8px #10b981",
                                }}
                            />
                            <span>Profile Live</span>
                        </div>

                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            title={theme === "dark" ? "Light mode" : "Dark mode"}
                        >
                            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                        </button>

                        <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                            <button
                                className="profile-btn"
                                onClick={() => setDropdownOpen((v) => !v)}
                                aria-expanded={dropdownOpen}
                                aria-haspopup="true"
                            >
                                <div className="profile-avatar">{initials}</div>
                                <span
                                    style={{
                                        maxWidth: 130,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user?.name || "Account"}
                                </span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="profile-dropdown" role="menu">
                                    <div className="profile-dropdown-info">
                                        <div className="profile-dropdown-name">{user?.name}</div>
                                        <div className="profile-dropdown-email">{user?.email}</div>
                                    </div>
                                    <div style={{ padding: "4px 0" }}>
                                        <Link
                                            to="/profile"
                                            className="profile-dropdown-item"
                                            role="menuitem"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <UserIcon size={14} /> Profile
                                        </Link>
                                        <Link
                                            to="/resume"
                                            className="profile-dropdown-item"
                                            role="menuitem"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <FileTextIcon size={14} /> Resume Builder
                                        </Link>
                                        <Link
                                            to="/preferences"
                                            className="profile-dropdown-item"
                                            role="menuitem"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <SettingsIcon size={14} /> Preferences
                                        </Link>
                                        <div className="profile-dropdown-divider" />
                                        <button
                                            className="profile-dropdown-item danger"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;