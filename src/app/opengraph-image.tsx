import { ImageResponse } from "next/og";

export const alt = "Syed Abdul Kareem — BE WEIRD specimen archive";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Deterministic fake-barcode bar widths (px). No randomness — stable output.
const BARCODE_BARS: number[] = [
  3, 1, 4, 1, 5, 2, 6, 1, 3, 5, 1, 2, 4, 1, 6, 2, 1, 3, 1, 4, 5, 1, 2, 6, 1,
  3, 2, 1, 5, 1, 4, 2, 3, 1, 6, 1, 2, 4, 1, 3,
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0E0C15",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Hazard top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FF4D00",
            padding: "14px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 12,
              color: "#0E0C15",
            }}
          >
            SPECIMEN ARCHIVE
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 18,
              letterSpacing: 4,
              color: "#0E0C15",
            }}
          >
            FILE №13 / CLASSIFIED
          </div>
        </div>

        {/* Dashed inset frame */}
        <div
          style={{
            position: "absolute",
            top: 78,
            left: 24,
            right: 24,
            bottom: 24,
            border: "2px dashed #4A4656",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            padding: "64px 72px 48px 72px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 6,
              color: "#6E4BFF",
              marginBottom: 24,
            }}
          >
            [ SUBJECT IDENTIFIED — DO NOT FOLD ]
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 96,
              fontWeight: 800,
              color: "#EFEAE3",
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            <div style={{ display: "flex" }}>SYED ABDUL</div>
            <div style={{ display: "flex" }}>KAREEM</div>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 26,
              letterSpacing: 4,
              color: "#FF4D00",
              marginTop: 28,
            }}
          >
            FORWARD DEPLOYED ENGINEER · ARCHIVE №13
          </div>

          {/* Barcode bottom-left */}
          <div
            style={{
              position: "absolute",
              left: 72,
              bottom: 44,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: 56,
              }}
            >
              {BARCODE_BARS.map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    width: w,
                    height: i % 7 === 0 ? 56 : 46,
                    backgroundColor: "#EFEAE3",
                    marginRight: 3,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "monospace",
                fontSize: 16,
                letterSpacing: 3,
                color: "#EFEAE3",
                marginTop: 10,
                opacity: 0.7,
              }}
            >
              github.com/SyedAbdulKareem13
            </div>
          </div>

          {/* BE WEIRD outlined, bottom-right */}
          <div
            style={{
              position: "absolute",
              right: 64,
              bottom: 36,
              display: "flex",
              fontSize: 110,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#0E0C15",
              WebkitTextStroke: "2px #EFEAE3",
            }}
          >
            BE WEIRD
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
