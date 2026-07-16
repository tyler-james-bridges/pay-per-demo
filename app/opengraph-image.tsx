import { ImageResponse } from "next/og";

export const alt = "Pay Per Demo — Send your agent to Demo Day for 1¢";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "rgba(255,255,255,0.34)",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Agentic Commerce Demo Day · accepting x402
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          lineHeight: 1,
        }}
      >
        pay-per-demo
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 30,
          color: "rgba(255,255,255,0.58)",
          fontSize: 32,
          lineHeight: 1.35,
        }}
      >
        Send your agent to Demo Day for&nbsp;
        <span style={{ color: "#4ade80", fontWeight: 700 }}>1¢.</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 850,
          marginTop: 66,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.3)",
          fontSize: 18,
        }}
      >
        <span>July 16, 2026 · virtual</span>
        <span>0.01 USDC · Base</span>
      </div>
    </div>,
    size,
  );
}
