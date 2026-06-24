import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Thomas Shackelford — Web Developer/Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #f3d8c2 0%, #e8b582 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <p
          style={{
            color: "#8c3e28",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Web Developer/Software Engineer · Lakewood, CA
        </p>
        <h1
          style={{
            color: "#2a2118",
            fontSize: 96,
            fontWeight: 800,
            margin: "16px 0 0",
            letterSpacing: "-0.02em",
          }}
        >
          Thomas Shackelford
        </h1>
        <p style={{ color: "#2a2118", fontSize: 28, margin: "32px 0 0", maxWidth: 800 }}>
          Thirteen years building accessible, high-performance web applications for fintech.
        </p>
      </div>
    ),
    { ...size }
  );
}
