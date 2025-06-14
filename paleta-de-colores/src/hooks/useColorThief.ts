import { useState, useEffect } from "react";
import ColorThief from "colorthief";

/**
 * Hook personalizado para extraer la paleta de colores de una imagen.
 * @param {string | null} imageUrl - La URL de la imagen a procesar.
 * @param {number} [colorCount=10] - El número de colores a extraer.
 * @param {'hex' | 'rgb'} [format='hex'] - El formato de color de salida.
 * @returns {{ palette: string[] | null, dominantColor: string | null, loading: boolean }}
 */
export const useColorThief = (
  imageUrl: string | null,
  colorCount = 10,
  format = "hex"
) => {
  const [palette, setPalette] = useState<string[] | null>(null);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const colorThief = new ColorThief();
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    setLoading(true);

    const rgbToHex = (r: number, g: number, b: number) =>
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");

    img.onload = () => {
      try {
        const dominantRgb = colorThief.getColor(img);
        const paletteRgb = colorThief.getPalette(img, colorCount);

        if (format === "hex") {
          setDominantColor(rgbToHex(...dominantRgb));
          setPalette(paletteRgb.map((color) => rgbToHex(...color)));
        } else {
          setDominantColor(`rgb(${dominantRgb.join(",")})`);
          setPalette(paletteRgb.map((color) => `rgb(${color.join(",")})`));
        }
      } catch (error) {
        console.error("Error al extraer los colores:", error);
      } finally {
        setLoading(false);
      }
    };

    img.onerror = (error) => {
      console.error("Error al cargar la imagen para color thief:", error);
      setLoading(false);
    };
  }, [imageUrl, colorCount, format]);

  return { palette, dominantColor, loading };
};
