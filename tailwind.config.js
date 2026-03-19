export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                panel: "rgb(var(--panel) / <alpha-value>)",
                card: "rgb(var(--card) / <alpha-value>)",
                border: "rgb(var(--border) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                "accent-soft": "rgb(var(--accent-soft) / <alpha-value>)",
                calm: "rgb(var(--calm) / <alpha-value>)",
                success: "rgb(var(--success) / <alpha-value>)",
                warn: "rgb(var(--warn) / <alpha-value>)",
                danger: "rgb(var(--danger) / <alpha-value>)"
            },
            fontFamily: {
                display: ["Sora", "Instrument Sans", "Segoe UI", "sans-serif"],
                sans: ["Instrument Sans", "Inter", "Segoe UI", "sans-serif"],
                mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"]
            },
            boxShadow: {
                glass: "0 18px 60px rgba(8, 15, 28, 0.28)",
                float: "0 14px 34px rgba(15, 23, 42, 0.16)"
            },
            backgroundImage: {
                "hero-grid": "radial-gradient(circle at top, rgba(109, 209, 196, 0.12), transparent 35%), radial-gradient(circle at 85% 15%, rgba(247, 182, 109, 0.15), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)"
            }
        }
    },
    plugins: []
};
