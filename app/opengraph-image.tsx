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
        justifyContent: "space-between",
        padding: "58px 64px",
        background: "#0b0f14",
        color: "#e7edf3",
        fontFamily: "Arial, sans-serif",
        border: "2px solid #293440",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 18,
              border: "2px solid #3a4856",
              color: "#78e6ad",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            ppd
          </div>
          <span>pay per demo</span>
        </div>
        <span style={{ color: "#78e6ad" }}>accepting x402</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            color: "#8d99a6",
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          agentic commerce demo day
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 1000,
            marginTop: 22,
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          Send your agent to Demo Day for&nbsp;
          <span style={{ color: "#f1c66d" }}>1¢.</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: "2px solid #293440",
          color: "#8d99a6",
          fontFamily: "monospace",
          fontSize: 20,
        }}
      >
        <span>July 16, 2026 · virtual</span>
        <span>0.01 USDC · Base</span>
      </div>
    </div>,
    size,
  );
}
