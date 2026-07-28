import { ImageResponse } from "next/og";

export const alt = "Pay Per Demo agent-paid virtual event access";
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
        x402 · virtual event access
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
          width: 950,
          justifyContent: "center",
          marginTop: 30,
          color: "rgba(255,255,255,0.58)",
          fontSize: 30,
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        An agent pays USDC over x402 and unlocks a private virtual event room.
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
        <span>current · /api/overflow</span>
        <span>reference · /api/demo</span>
      </div>
    </div>,
    size,
  );
}
