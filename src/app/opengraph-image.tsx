import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#17172f",
          backgroundImage: "radial-gradient(circle at 75% 30%, #e4006c33 0%, transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 800,
            color: "#ffffff",
          }}
        >
          Mr.travels
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            width: 140,
            height: 6,
            borderRadius: 999,
            backgroundColor: "#e4006c",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 32,
            fontWeight: 500,
            color: "#e4006c",
          }}
        >
          Flights & Travel Deals
        </div>
      </div>
    ),
    { ...size }
  );
}
