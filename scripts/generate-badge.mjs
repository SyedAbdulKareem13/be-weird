/**
 * Generates the lanyard badge textures + favicon for the SPECIMEN ARCHIVE.
 * Run once (outputs are committed): node scripts/generate-badge.mjs
 *
 * - public/assets/lanyard/badge-front.png  → Lanyard frontImage (real QR → GitHub)
 * - public/assets/lanyard/badge-back.png   → Lanyard backImage
 * - public/assets/lanyard/strap.png        → Lanyard strap texture
 * - public/favicon.svg                     → hazard ✱ on ink
 */
import sharp from "sharp";
import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";

const INK = "#0E0C15";
const BONE = "#EFEAE3";
const HAZARD = "#FF4D00";
const ULTRAVIOLET = "#6E4BFF";
const SPECIMEN = "#101322";

const QR_TARGET = "https://github.com/SyedAbdulKareem13";
const MONO = "Courier New, monospace";

mkdirSync("public/assets/lanyard", { recursive: true });

const qrDataUrl = await QRCode.toDataURL(QR_TARGET, {
  errorCorrectionLevel: "M",
  margin: 1,
  width: 512,
  color: { dark: "0E0C15FF", light: "EFEAE3FF" },
});

// Card front — 710x1000 (matches card mesh aspect, cover-fit crops little).
const barcodeBars = Array.from({ length: 36 }, (_, i) => {
  const x = 60 + i * 9;
  const w = [2, 5, 3, 6, 2, 4][i % 6];
  return `<rect x="${x}" y="855" width="${w}" height="60" fill="${BONE}"/>`;
}).join("");

const front = `<svg xmlns="http://www.w3.org/2000/svg" width="710" height="1000" viewBox="0 0 710 1000">
  <rect width="710" height="1000" fill="${SPECIMEN}"/>
  <rect x="24" y="24" width="662" height="952" fill="none" stroke="${BONE}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="10 8"/>
  <rect x="0" y="0" width="710" height="86" fill="${HAZARD}"/>
  <text x="60" y="56" font-family="${MONO}" font-size="28" font-weight="bold" letter-spacing="6" fill="${INK}">SPECIMEN ARCHIVE</text>
  <text x="60" y="200" font-family="${MONO}" font-size="22" letter-spacing="4" fill="${BONE}" opacity="0.65">SUBJECT</text>
  <text x="60" y="278" font-family="Arial Black, Arial, sans-serif" font-size="58" font-weight="900" fill="${BONE}">SYED ABDUL</text>
  <text x="60" y="348" font-family="Arial Black, Arial, sans-serif" font-size="58" font-weight="900" fill="${BONE}">KAREEM</text>
  <text x="60" y="420" font-family="${MONO}" font-size="24" letter-spacing="2" fill="${HAZARD}">FORWARD DEPLOYED ENGINEER</text>
  <text x="60" y="480" font-family="${MONO}" font-size="24" letter-spacing="3" fill="${BONE}" opacity="0.8">ARCHIVE №13</text>
  <g transform="translate(60, 530)">
    <rect x="-12" y="-12" width="264" height="264" fill="${BONE}"/>
    <image href="${qrDataUrl}" x="0" y="0" width="240" height="240"/>
  </g>
  <text x="60" y="836" font-family="${MONO}" font-size="18" letter-spacing="2" fill="${BONE}" opacity="0.6">SCAN FOR EVIDENCE → GITHUB</text>
  ${barcodeBars}
  <text x="60" y="950" font-family="${MONO}" font-size="18" letter-spacing="4" fill="${ULTRAVIOLET}">SYD-∞-13 · HANDLE WITH CURIOSITY</text>
</svg>`;

// Card back — quieter: logo mark + stamp.
const back = `<svg xmlns="http://www.w3.org/2000/svg" width="710" height="1000" viewBox="0 0 710 1000">
  <rect width="710" height="1000" fill="${SPECIMEN}"/>
  <rect x="24" y="24" width="662" height="952" fill="none" stroke="${BONE}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="355" y="420" font-family="Arial Black, Arial, sans-serif" font-size="120" font-weight="900" fill="none" stroke="${BONE}" stroke-width="2" text-anchor="middle" opacity="0.9">SYD/13</text>
  <g transform="rotate(-8 355 560)">
    <rect x="185" y="520" width="340" height="80" fill="none" stroke="${ULTRAVIOLET}" stroke-width="4"/>
    <text x="355" y="572" font-family="${MONO}" font-size="34" font-weight="bold" letter-spacing="6" fill="${ULTRAVIOLET}" text-anchor="middle">APPROVED-ISH</text>
  </g>
  <text x="355" y="700" font-family="${MONO}" font-size="22" letter-spacing="4" fill="${HAZARD}" text-anchor="middle">BE WEIRD</text>
  <text x="355" y="920" font-family="${MONO}" font-size="16" letter-spacing="2" fill="${BONE}" opacity="0.5" text-anchor="middle">IF FOUND, RETURN TO THE INTERNET</text>
</svg>`;

// Strap texture — repeated along the band (repeat [-4, 1]).
const strapText = "BE WEIRD ⚠ STAY CURIOUS ⚠ ";
const strap = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="128" viewBox="0 0 1024 128">
  <rect width="1024" height="128" fill="${INK}"/>
  <rect y="0" width="1024" height="10" fill="${HAZARD}"/>
  <rect y="118" width="1024" height="10" fill="${HAZARD}"/>
  <text x="512" y="82" font-family="${MONO}" font-size="44" font-weight="bold" letter-spacing="10" fill="${BONE}" text-anchor="middle">${strapText}${strapText.slice(0, 10)}</text>
</svg>`;

await sharp(Buffer.from(front)).png().toFile("public/assets/lanyard/badge-front.png");
await sharp(Buffer.from(back)).png().toFile("public/assets/lanyard/badge-back.png");
await sharp(Buffer.from(strap)).png().toFile("public/assets/lanyard/strap.png");

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <text x="32" y="46" font-family="Georgia, serif" font-size="44" fill="${HAZARD}" text-anchor="middle">✱</text>
</svg>`;
writeFileSync("public/favicon.svg", favicon);

console.log("badge-front.png, badge-back.png, strap.png, favicon.svg written");
