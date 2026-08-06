import sharp from "sharp";

type WatermarkOptions = {
  name: string;
};

/** Escape ký tự đặc biệt trong text SVG. */
function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Tạo overlay SVG chèn tên người dùng lên ảnh. */
function buildNameOverlaySvg(width: number, height: number, name: string): Buffer {
  const fontSize = Math.max(28, Math.floor(width * 0.05));
  const padding = Math.floor(fontSize * 0.6);
  const barHeight = fontSize + padding * 2;
  const safeName = escapeSvgText(name);

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="${height - barHeight}" width="${width}" height="${barHeight}" fill="rgba(0,0,0,0.55)" />
      <text
        x="50%"
        y="${height - barHeight / 2}"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
      >${safeName}</text>
    </svg>
  `;

  return Buffer.from(svg);
}

/** Chèn watermark tên lên buffer ảnh bằng Sharp. */
export async function applyNameWatermark(
  imageBuffer: Buffer,
  options: WatermarkOptions,
): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width ?? 1024;
  const height = metadata.height ?? 1024;
  const overlay = buildNameOverlaySvg(width, height, options.name);

  return sharp(imageBuffer)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png()
    .toBuffer();
}
