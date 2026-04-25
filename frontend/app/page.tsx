import Link from "next/link";
import {
  Hexagon,
  Layers,
  Eye,
  GitCompare,
  Target,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "7 Block Types",
    description: "Role, Context, Constraint, Format, Tone, Example, and Output Length",
  },
  {
    icon: Eye,
    title: "Live Assembly",
    description: "Watch your prompt build in real-time with color-coded segments",
  },
  {
    icon: GitCompare,
    title: "A/B Comparison",
    description: "Toggle blocks on/off and diff prompts with LCS algorithm",
  },
  {
    icon: Target,
    title: "Structural Score",
    description: "Completeness badge tracks coverage across all 7 dimensions",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ─── Background Layers ─── */}
      {/* Layer 1: Base gradient */}
      <div className="absolute inset-0 bg-bg-primary" />

      {/* Layer 2: Dot grid */}
      <div className="absolute inset-0 dot-grid" />

      {/* Layer 3: Animated gradient blobs */}
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-accent/[0.07] blur-[120px] animate-blob" />
      <div
        className="absolute top-[200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-accent-violet/[0.06] blur-[120px] animate-blob"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute bottom-[-100px] left-[40%] w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-[100px] animate-blob"
        style={{ animationDelay: "8s" }}
      />

      {/* Layer 4: Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, #070B14 80%)",
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Eyebrow */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: "0s" }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-bg-card/50 text-[11px] text-text-muted font-[family-name:var(--font-ui)] tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-accent" />
            PS-05 · Frontend Hackathon 2025
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-6xl md:text-8xl font-extrabold font-[family-name:var(--font-display)] gradient-text text-center leading-[1.1] mb-6 animate-fade-up"
          style={{ animationDelay: "0.08s" }}
        >
          Project<br />Lexicon
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-text-dim text-center max-w-xl leading-relaxed mb-10 font-[family-name:var(--font-ui)] animate-fade-up"
          style={{ animationDelay: "0.16s" }}
        >
          Compose. Compare. Understand.
          <br />
          <span className="text-text-muted text-base">
            A block-based prompt composition interface with structural intelligence.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className="flex items-center gap-4 mb-20 animate-fade-up"
          style={{ animationDelay: "0.24s" }}
        >
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-xl shadow-lg shadow-accent/25 hover:brightness-110 transition-all"
          >
            Open Canvas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle text-text-dim rounded-xl hover:border-border-active hover:text-text-primary hover:bg-white/[0.02] transition-all"
          >
            View Source
          </a>
        </div>

        {/* Features Strip */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full animate-fade-up"
          style={{ animationDelay: "0.32s" }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-5 flex flex-col gap-3 group hover:border-border-active transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                <feature.icon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary font-[family-name:var(--font-display)]">
                {feature.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Logo watermark */}
        <div className="absolute bottom-8 flex items-center gap-2 text-text-muted/30">
          <Hexagon className="w-4 h-4" />
          <span className="text-[10px] font-[family-name:var(--font-ui)] tracking-widest uppercase">
            Lexicon
          </span>
        </div>
      </div>
    </div>
  );
}
