import { commonColors } from "./colorNameDictionary";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}
interface HslColor {
  h: number;
  s: number;
  l: number;
}

const hexToRgb = (hex: string): RgbColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (r: number, g: number, b: number): HslColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Calcula la distancia perceptual entre dos colores HSL.
 * Da una alta prioridad a la diferencia de tono (hue).
 */
const getPerceptualDistance = (hsl1: HslColor, hsl2: HslColor): number => {
  // Distancia del tono (cíclica)
  const hueDiff = Math.min(
    Math.abs(hsl1.h - hsl2.h),
    360 - Math.abs(hsl1.h - hsl2.h)
  );
  const satDiff = hsl1.s - hsl2.s;
  const lumDiff = hsl1.l - hsl2.l;

  // Asignamos un peso 3 veces mayor al tono.
  const HUE_WEIGHT = 3;

  return Math.sqrt(
    Math.pow(hueDiff * HUE_WEIGHT, 2) +
      Math.pow(satDiff, 2) +
      Math.pow(lumDiff, 2)
  );
};

const findClosestColorName = (targetHsl: HslColor): string => {
  let closestColor = { name: "Desconocido", distance: Infinity };

  for (const color of commonColors) {
    const dictionaryRgb = hexToRgb(color.hex);
    if (dictionaryRgb) {
      const dictionaryHsl = rgbToHsl(
        dictionaryRgb.r,
        dictionaryRgb.g,
        dictionaryRgb.b
      );
      const distance = getPerceptualDistance(targetHsl, dictionaryHsl);
      if (distance < closestColor.distance) {
        closestColor = { name: color.name, distance: distance };
      }
    }
  }
  return closestColor.name;
};

const getSmartColorName = (hexColor: string): string => {
  const targetRgb = hexToRgb(hexColor);
  if (!targetRgb) return "Color Desconocido";

  const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

  // --- UMBRAL MUY ESTRICTO PARA NEUTROS ---
  // Solo si la saturación es menor a 10, es un gris/blanco/negro.
  const ACHROMATIC_SATURATION_THRESHOLD = 10;

  if (targetHsl.s < ACHROMATIC_SATURATION_THRESHOLD) {
    if (targetHsl.l < 10) return "Negro";
    if (targetHsl.l > 95) return "Blanco";
    return "Gris";
  }

  // --- LÓGICA PRINCIPAL ---
  // Para cualquier otro color con un mínimo de tono, buscamos el más cercano
  // usando el algoritmo de distancia perceptual.
  return findClosestColorName(targetHsl);
};

export const nameColorsInSpanish = async (
  hexColors: string[]
): Promise<string[]> => {
  return hexColors.map((hex) => getSmartColorName(hex));
};
