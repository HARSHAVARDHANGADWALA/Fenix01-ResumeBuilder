import apiRequest from "../services/api";

export interface Persona {
    id: string;
    title: string;
    badge: string;
    headline: string;
    bio: string;
    location: string;
    phone: string;
    linkedin_url: string;
    portfolio_url: string;
    skills: string[];
    projects: {
        title: string;
        description: string;
        technologies: string;
        github_url: string;
        live_url: string;
    }[];
    experience: {
        job_title: string;
        company: string;
        location: string;
        start_date: string;
        end_date: string;
        is_current: boolean;
        description: string;
    }[];
    education: {
        degree: string;
        institution: string;
        field_of_study: string;
        start_year: number;
        end_year: number;
        grade: string;
        description: string;
    }[];
    certifications: {
        name: string;
        issuing_organization: string;
        issue_date: string;
        credential_id: string;
    }[];
}

export const PERSONAS: Persona[] = [
    {
        id: "fullstack",
        title: "Senior Full-Stack Engineer",
        badge: "Web & Distributed Systems",
        headline: "Senior Full-Stack Engineer · React, TypeScript & Node.js",
        bio: "Full-stack engineer with 5+ years of experience architecting high-throughput SaaS web applications and event-driven microservices. Passionate about developer tooling, web performance, and resilient API architectures.",
        location: "San Francisco, CA (or Remote)",
        phone: "+1 (555) 382-9102",
        linkedin_url: "https://linkedin.com/in/alex-dev-fullstack",
        portfolio_url: "https://alexchen.dev",
        skills: [
            "TypeScript", "React", "Next.js", "Node.js", "Express",
            "PostgreSQL", "Redis", "Docker", "AWS", "GraphQL",
            "REST APIs", "Tailwind CSS", "Jest", "CI/CD", "Git"
        ],
        projects: [
            {
                title: "PulseCloud — Real-Time Infrastructure Monitoring",
                description: "Built a distributed telemetry dashboard handling 50k events/sec with WebSocket subscriptions, server-side caching, and interactive data visualization.",
                technologies: "React, TypeScript, Node.js, Redis, PostgreSQL, Docker",
                github_url: "https://github.com/example/pulse-cloud",
                live_url: "https://pulsecloud-demo.vercel.app",
            },
            {
                title: "HyperQueue — High-Performance Job Scheduler",
                description: "Engineered an open-source background task processor with guaranteed at-least-once delivery, exponential backoff retries, and Prometheus metrics export.",
                technologies: "TypeScript, Node.js, Redis, Docker, Prometheus",
                github_url: "https://github.com/example/hyper-queue",
                live_url: "https://hyperqueue.dev",
            },
            {
                title: "OmniCart — Headless E-Commerce Engine",
                description: "Designed a multi-tenant checkout pipeline with Stripe integration, optimistic UI updates, and sub-100ms global response times.",
                technologies: "Next.js, React, PostgreSQL, Tailwind CSS, Stripe",
                github_url: "https://github.com/example/omni-cart",
                live_url: "https://omnicart.dev",
            }
        ],
        experience: [
            {
                job_title: "Senior Software Engineer",
                company: "Linear Dynamics Corp",
                location: "San Francisco, CA",
                start_date: "2023-03-01",
                end_date: "",
                is_current: true,
                description: "Lead frontend architecture for internal workspace tools. Reduced web application LCP by 42% through bundle tree-shaking and server-side rendering optimizations.",
            },
            {
                job_title: "Full-Stack Software Engineer",
                company: "Nexus Labs",
                location: "Remote",
                start_date: "2021-06-01",
                end_date: "2023-02-28",
                is_current: false,
                description: "Developed customer billing and onboarding microservices in Node.js and PostgreSQL. Designed public REST APIs consumed by 12,000+ daily active developers.",
            }
        ],
        education: [
            {
                degree: "B.S. in Computer Science",
                institution: "University of California, Berkeley",
                field_of_study: "Software Engineering & Systems",
                start_year: 2017,
                end_year: 2021,
                grade: "3.85 GPA",
                description: "Coursework: Distributed Systems, Database Architecture, Computer Networks, Algorithms.",
            }
        ],
        certifications: [
            {
                name: "AWS Certified Solutions Architect – Associate",
                issuing_organization: "Amazon Web Services",
                issue_date: "2023-08-15",
                credential_id: "AWS-SAA-839210",
            }
        ]
    },
    {
        id: "frontend",
        title: "Frontend UI/UX Specialist",
        badge: "Design Systems & Interfaces",
        headline: "Staff Frontend Engineer · Design Systems & Web Performance",
        bio: "Frontend engineer dedicated to building accessible, fluid, and delightful web products. Specialized in React component architecture, animation primitives, and zero-runtime CSS tokens.",
        location: "New York, NY",
        phone: "+1 (555) 749-2184",
        linkedin_url: "https://linkedin.com/in/sarah-frontend-ui",
        portfolio_url: "https://sarahdesign.dev",
        skills: [
            "React", "TypeScript", "Next.js", "Design Systems", "CSS Architecture",
            "Figma to Code", "Accessibility (a11y)", "Tailwind CSS", "Framer Motion",
            "Web Performance", "State Management", "Vite", "Testing Library"
        ],
        projects: [
            {
                title: "Atelier — Zero-Dependency Component Library",
                description: "Authored an accessible, themeable design token system used across 14 enterprise micro-frontends with 100% WCAG AA compliance.",
                technologies: "React, TypeScript, CSS Variables, Radix UI primitives",
                github_url: "https://github.com/example/atelier-ui",
                live_url: "https://atelier-ui.dev",
            },
            {
                title: "CanvasFlow — Collaborative Vector Editor",
                description: "Built a browser-based canvas editor with 60fps rendering, custom bezier toolbars, and real-time multiplayer cursor synchronization.",
                technologies: "React, HTML5 Canvas, WebSockets, TypeScript",
                github_url: "https://github.com/example/canvas-flow",
                live_url: "https://canvasflow.app",
            }
        ],
        experience: [
            {
                job_title: "Staff Frontend Engineer",
                company: "Veloce Design Systems",
                location: "New York, NY",
                start_date: "2022-05-01",
                end_date: "",
                is_current: true,
                description: "Architect core design system packages. Mentored 8 engineers on semantic HTML, keyboard focus management, and Core Web Vitals optimization.",
            }
        ],
        education: [
            {
                degree: "B.S. in Human-Computer Interaction",
                institution: "Carnegie Mellon University",
                field_of_study: "Interactive Software & Design",
                start_year: 2018,
                end_year: 2022,
                grade: "3.92 GPA",
                description: "Emphasis on cognitive psychology, interactive prototyping, and software engineering.",
            }
        ],
        certifications: [
            {
                name: "Certified Web Accessibility Specialist (WAS)",
                issuing_organization: "IAAP",
                issue_date: "2023-04-10",
                credential_id: "IAAP-WAS-2918",
            }
        ]
    },
    {
        id: "cloud",
        title: "Cloud & DevOps Architect",
        badge: "Infrastructure & Security",
        headline: "DevOps & Cloud Architect · Kubernetes, Terraform & AWS",
        bio: "Infrastructure engineer with deep expertise in cloud automation, zero-trust security pipelines, and high-availability Kubernetes deployments across multi-region environments.",
        location: "Austin, TX (Remote)",
        phone: "+1 (555) 912-4028",
        linkedin_url: "https://linkedin.com/in/marcus-cloud-devops",
        portfolio_url: "https://marcuscloud.io",
        skills: [
            "Kubernetes", "Docker", "Terraform", "AWS", "CI/CD Pipelines",
            "Linux", "Go", "Python", "Prometheus", "Grafana",
            "PostgreSQL", "ArgoCD", "Bash", "Security Auditing"
        ],
        projects: [
            {
                title: "TerraBase — Multi-Cloud Provisioning Framework",
                description: "Constructed modular Terraform libraries provisioning resilient EKS clusters with automated TLS, external DNS, and cost-attribution tags.",
                technologies: "Terraform, AWS EKS, Helm, Go",
                github_url: "https://github.com/example/terra-base",
                live_url: "https://terrabase.io",
            },
            {
                title: "SentinelCI — Automated Security Gatekeeper",
                description: "Created a GitHub Actions security scanner checking Docker images for CVEs, credential leaks, and license violations prior to deployment.",
                technologies: "Go, Docker, GitHub Actions, Trivy",
                github_url: "https://github.com/example/sentinel-ci",
                live_url: "https://sentinelci.dev",
            }
        ],
        experience: [
            {
                job_title: "Senior Cloud Infrastructure Engineer",
                company: "Apex Cloud Technologies",
                location: "Austin, TX",
                start_date: "2021-09-01",
                end_date: "",
                is_current: true,
                description: "Architected 99.99% uptime Kubernetes infrastructure supporting 40+ production microservices. Reduced monthly AWS cloud spend by 31% via spot orchestration.",
            }
        ],
        education: [
            {
                degree: "B.S. in Information Systems",
                institution: "University of Texas at Austin",
                field_of_study: "Systems Architecture & Cloud Infrastructure",
                start_year: 2016,
                end_year: 2020,
                grade: "3.78 GPA",
                description: "Cap-stone project in distributed container orchestration.",
            }
        ],
        certifications: [
            {
                name: "Certified Kubernetes Administrator (CKA)",
                issuing_organization: "Cloud Native Computing Foundation",
                issue_date: "2022-11-20",
                credential_id: "CKA-29103-MAR",
            }
        ]
    }
];

export async function populatePersona(persona: Persona, onProgress?: (msg: string) => void): Promise<void> {
    onProgress?.("Saving professional profile details…");
    await apiRequest("/profile", {
        method: "POST",
        body: JSON.stringify({
            headline: persona.headline,
            bio: persona.bio,
            location: persona.location,
            phone: persona.phone,
            linkedin_url: persona.linkedin_url,
            portfolio_url: persona.portfolio_url,
        }),
    });

    onProgress?.("Adding technical skills…");
    for (const skill of persona.skills) {
        try {
            await apiRequest("/skills", {
                method: "POST",
                body: JSON.stringify({ skill_name: skill }),
            });
        } catch {
            // ignore duplicate skills
        }
    }

    onProgress?.("Adding featured projects…");
    for (const project of persona.projects) {
        try {
            await apiRequest("/projects", {
                method: "POST",
                body: JSON.stringify(project),
            });
        } catch {
            // ignore errors
        }
    }

    onProgress?.("Adding work history…");
    for (const exp of persona.experience) {
        try {
            await apiRequest("/experience", {
                method: "POST",
                body: JSON.stringify(exp),
            });
        } catch {
            // ignore errors
        }
    }

    onProgress?.("Adding academic qualifications…");
    for (const edu of persona.education) {
        try {
            await apiRequest("/education", {
                method: "POST",
                body: JSON.stringify(edu),
            });
        } catch {
            // ignore errors
        }
    }

    onProgress?.("Adding credentials & certifications…");
    for (const cert of persona.certifications) {
        try {
            await apiRequest("/certifications", {
                method: "POST",
                body: JSON.stringify(cert),
            });
        } catch {
            // ignore errors
        }
    }

    onProgress?.("Profile successfully configured!");
}
