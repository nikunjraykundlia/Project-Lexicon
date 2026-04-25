import Link from "next/link";
import FaultyTerminal from "@/components/home/FaultyTerminal";
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
    <div className="relative min-h-screen overflow-hidden bg-bg-primary">
      <div className="absolute inset-0 opacity-80">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#5BB2FF"
          mouseReact
          mouseStrength={0.4}
          pageLoadAnimation
          brightness={0.5}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,158,255,0.2),_transparent_42%),linear-gradient(180deg,_rgba(7,11,20,0.1)_0%,_rgba(7,11,20,0.72)_72%,_rgba(7,11,20,0.96)_100%)]" />
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 38%, rgba(7, 11, 20, 0.92) 82%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="mb-6 animate-fade-up" style={{ animationDelay: "0s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-card/50 px-4 py-1.5 text-[11px] font-[family-name:var(--font-ui)] tracking-widest text-text-muted uppercase">
            <Sparkles className="h-3 w-3 text-accent" />
            PS-05 · Frontend Hackathon 2025
          </span>
        </div>

        <h1
          className="gradient-text mb-6 text-center font-[family-name:var(--font-display)] text-6xl leading-[1.1] font-extrabold animate-fade-up md:text-8xl"
          style={{ animationDelay: "0.08s" }}
        >
          Project
          <br />
          Lexicon
        </h1>

        <p
          className="mb-10 max-w-xl text-center font-[family-name:var(--font-ui)] text-lg leading-relaxed text-text-dim animate-fade-up md:text-xl"
          style={{ animationDelay: "0.16s" }}
        >
          Compose. Compare. Understand.
          <br />
          <span className="text-base text-text-muted">
            A block-based prompt composition interface with structural intelligence.
          </span>
        </p>

        <div
          className="mb-20 flex items-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.24s" }}
        >
          <Link
            href="/canvas"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-white shadow-lg shadow-accent/25 transition-all hover:brightness-110"
          >
            Open Canvas
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-6 py-3 text-text-dim transition-all hover:border-border-active hover:bg-white/[0.02] hover:text-text-primary"
          >
            View Source
          </a>
        </div>

        <div
          className="grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-up sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: "0.32s" }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass-card group flex flex-col gap-3 p-5 transition-all hover:border-border-active"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
                <feature.icon className="h-4 w-4 text-accent" />
              </div>
              <h3 className="text-sm font-[family-name:var(--font-display)] font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 flex items-center gap-2 text-text-muted/30">
          <Hexagon className="h-4 w-4" />
          <span className="text-[10px] font-[family-name:var(--font-ui)] tracking-widest uppercase">
            Lexicon
          </span>
        </div>
      </div>
    </div>
  );
}
