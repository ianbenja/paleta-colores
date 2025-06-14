import { useState, useEffect } from "react";
import ColorThief from "colorthief";
// IMPORTANTE: Importamos desde el nuevo archivo de servicio.

import { nameColorsInSpanish } from "../services/colorNamingService";
type PaletteColor = { hex: string; name: string };
type DominantColor = { hex: string; name: string } | null;

export const useColorThief = (imageUrl: string | null, colorCount = 10) => {
  const [palette, setPalette] = useState<PaletteColor[] | null>(null);
  const [dominantColor, setDominantColor] = useState<DominantColor>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (!imageUrl) {
      setPalette(null);
      setDominantColor(null);
      return;
    }

    const processImage = async () => {
      setLoading(true);
      setStatusText("Analizando los colores de la imagen...");
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = async () => {
        try {
          // 1. Extraer los colores
          const dominantRgb = colorThief.getColor(img);
          const paletteRgb = colorThief.getPalette(img, colorCount);

          const rgbToHex = (r: number, g: number, b: number): string =>
            "#" +
            [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

          const allHexColors = [
            rgbToHex(...dominantRgb),
            ...paletteRgb.map((color) => rgbToHex(...color)),
          ];

          // 2. Obtener los nombres comunes en español para todos los colores
          setStatusText("Buscando nombres para los colores...");
          const spanishNames = await nameColorsInSpanish(allHexColors);

          // 3. Combinar los resultados y actualizar el estado
          const [dominantName, ...paletteNames] = spanishNames;
          setDominantColor({ hex: allHexColors[0], name: dominantName });
          setPalette(
            paletteNames.map((name, index) => ({
              hex: allHexColors[index + 1],
              name: name,
            }))
          );
        } catch (error) {
          console.error("Error procesando la imagen:", error);
          setPalette(null);
          setDominantColor(null);
        } finally {
          setLoading(false);
          setStatusText("");
        }
      };

      img.onerror = () => {
        console.error("Error al cargar la imagen.");
        setLoading(false);
        setStatusText("No se pudo cargar la imagen.");
      };
    };

    processImage();
  }, [imageUrl, colorCount]);

  return { palette, dominantColor, loading, statusText };
};
