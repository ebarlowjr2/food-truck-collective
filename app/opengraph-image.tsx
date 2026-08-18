import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "OnTheCurb — locate your food truck on a live map";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#E4572E";
const ACCENT = "#F6AE2D";
const INK = "#1C1A19";
const CREAM = "#FFF7EF";

/** A teardrop map pin echoing the site's markers. */
// NOTE: Satori has no z-index; stacking follows document order, so pins are
// listed back-to-front (largest/frontmost last).
function Pin({
  color,
  size: s,
  top,
  left,
}: {
  color: string;
  size: number;
  top: number;
  left: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: s,
        height: s,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        border: "6px solid #fff",
        borderRadius: "50% 50% 50% 0",
        transform: "rotate(-45deg)",
        boxShadow: "0 12px 24px rgba(28,26,25,0.25)",
      }}
    >
      <div
        style={{
          width: s * 0.34,
          height: s * 0.34,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    </div>
  );
}

export default async function Image() {
  const [extraBold, semiBold, medium] = await Promise.all([
    readFile(join(process.cwd(), "assets/Poppins-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/Poppins-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/Poppins-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: CREAM,
          fontFamily: "Poppins",
          padding: "64px 72px",
          overflow: "hidden",
        }}
      >
        {/* Decorative background blooms */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: ACCENT,
            opacity: 0.22,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: BRAND,
            opacity: 0.12,
          }}
        />

        {/* Top badge */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#fff",
              border: `2px solid ${BRAND}33`,
              color: BRAND,
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#16a34a",
              }}
            />
            LIVE MAP · CENTRAL ALABAMA
          </div>
        </div>

        {/* Headline + pin cluster */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 92,
                fontWeight: 800,
                color: INK,
                lineHeight: 1.02,
                letterSpacing: -2,
              }}
            >
              Locate your
            </div>
            <div
              style={{
                fontSize: 92,
                fontWeight: 800,
                color: BRAND,
                lineHeight: 1.02,
                letterSpacing: -2,
              }}
            >
              food truck.
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 30,
                fontWeight: 500,
                color: "#5c5651",
                maxWidth: 620,
                lineHeight: 1.35,
              }}
            >
              See where every truck is parked right now, book one for your event,
              and list your own.
            </div>
          </div>

          {/* Pin cluster */}
          <div
            style={{
              position: "relative",
              display: "flex",
              width: 300,
              height: 300,
            }}
          >
            <Pin color={ACCENT} size={110} top={20} left={150} />
            <Pin color="#2E86AB" size={120} top={140} left={30} />
            <Pin color={BRAND} size={150} top={90} left={120} />
          </div>
        </div>

        {/* Footer wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 62,
                height: 62,
                borderRadius: 18,
                background: BRAND,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: BRAND,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: INK,
                letterSpacing: -0.5,
              }}
            >
              OnTheCurb
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: "#8a837d" }}>
            Trucks · Trailers · Tables
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: extraBold, style: "normal", weight: 800 },
        { name: "Poppins", data: semiBold, style: "normal", weight: 600 },
        { name: "Poppins", data: medium, style: "normal", weight: 500 },
      ],
    }
  );
}
