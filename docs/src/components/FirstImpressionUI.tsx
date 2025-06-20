import React, { useRef, useState } from "react";
import "./FirstImpressionUI.css";

export default function FirstImpressionUI({ onDone }: { onDone: (input: string) => void }) {
  const [input, setInput] = useState("");
  const [showEffect, setShowEffect] = useState(false);
  const [effectText, setEffectText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setEffectText(input);
    setShowEffect(true);
    setTimeout(() => {
      setShowEffect(false);
      onDone(input);
      setInput("");
    }, 2200);
  };

  return (
    <div className="first-impression-container">
      <h1>✨ Welcome to NovaRay</h1>
      <p className="subtitle">
        The playground for creative minds, curious souls, and tireless AIs.
      </p>
      <blockquote>
        <em>“Every journey starts with a single spark.”</em>
      </blockquote>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="who" className="prompt-label">
          Who are you today?
        </label>
        <input
          id="who"
          type="text"
          ref={inputRef}
          className={`prompt-input ${showEffect ? "hidden" : ""}`}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={showEffect}
          placeholder="Type anything and press Enter..."
          aria-label="Type anything and press Enter"
        />
      </form>
      {showEffect && <SmokeEffect text={effectText} />}
      <div className="entry-footer">
        (The magic begins the moment you press Enter.)
      </div>
    </div>
  );
}

// Minimal smoke effect using canvas
function SmokeEffect({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 460;
    const height = 100;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "32px 'Fira Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#aaf";
    ctx.shadowBlur = 18;
    ctx.fillText(text, width / 2, height / 2 + 12);

    let frame = 0;
    let alpha = 1.0;

    function animate() {
      frame++;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = "32px 'Fira Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#aaf";
      ctx.shadowBlur = 24;
      ctx.translate(width / 2, height / 2 + 12 - frame * 0.7);
      ctx.rotate((Math.random() - 0.5) * 0.06);
      ctx.fillText(text, 0, 0);
      ctx.restore();

      alpha *= 0.96; // fade out
      if (alpha > 0.02) {
        requestAnimationFrame(animate);
      }
    }
    animate();
    // eslint-disable-next-line
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      width={460}
      height={100}
      className="smoke-effect-canvas"
      aria-hidden="true"
    />
  );
}