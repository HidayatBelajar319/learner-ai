/**
 * Utility tema runtime untuk AI UI Editor.
 * Mengubah warna dasar (hex) menjadi ramp warna 50–900 + DEFAULT,
 * yang diterapkan sebagai CSS variables (format triplet "r g b")
 * agar seluruh class Tailwind `primary-*` ikut berubah tanpa rebuild.
 */

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = String(hex || '#4F46E5').trim();
  if (!h.startsWith('#')) h = `#${h}`;
  const m = h.replace('#', '');
  if (m.length === 3) {
    return {
      r: parseInt(m[0] + m[0], 16),
      g: parseInt(m[1] + m[1], 16),
      b: parseInt(m[2] + m[2], 16),
    };
  }
  const full = m.padEnd(6, '0').slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbTriplet(r: number, g: number, b: number): string {
  return `${clamp(r)} ${clamp(g)} ${clamp(b)}`;
}

/**
 * Membuat ramp warna dari warna dasar.
 * 50–400 = campur putih, 600–900 = campur hitam, 500 & DEFAULT = warna dasar.
 */
export function makePalette(baseHex: string): Record<string, string> {
  const { r, g, b } = hexToRgb(baseHex);
  const mix = (ratio: number, target: { r: number; g: number; b: number }) =>
    rgbTriplet(
      r + (target.r - r) * ratio,
      g + (target.g - g) * ratio,
      b + (target.b - b) * ratio,
    );

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  return {
    DEFAULT: rgbTriplet(r, g, b),
    50: mix(0.92, white),
    100: mix(0.84, white),
    200: mix(0.7, white),
    300: mix(0.52, white),
    400: mix(0.3, white),
    500: rgbTriplet(r, g, b),
    600: mix(0.14, black),
    700: mix(0.26, black),
    800: mix(0.38, black),
    900: mix(0.52, black),
  };
}

/** Pastikan warna sidebar cukup kontras terhadap teks yang diberikan. */
export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}
