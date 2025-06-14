import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";

// Definimos los tipos que el componente espera
type PaletteColor = {
  hex: string;
  name: string;
};

type DominantColor = {
  hex: string;
  name: string;
} | null;

interface ColorPaletteProps {
  palette: PaletteColor[] | null;
  dominantColor: DominantColor;
  loading: boolean;
}

interface ColorSwatchProps {
  color: PaletteColor;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  palette,
  dominantColor,
  loading,
}) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedColor(text);
        setTimeout(() => setCopiedColor(null), 2000);
      })
      .catch((err) => {
        console.error("Falló al copiar: ", err);
      });
  };

  const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => (
    <div
      className="relative rounded-lg h-28 flex flex-col justify-end p-3 cursor-pointer group transition-transform transform hover:scale-105 shadow-lg"
      style={{ backgroundColor: color.hex }}
      onClick={() => copyToClipboard(color.hex)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
      <div className="relative z-10 text-left">
        <p className="text-white font-bold text-sm drop-shadow-md capitalize">
          {color.name}
        </p>
        <p className="text-gray-300 font-mono text-xs drop-shadow-md">
          {color.hex}
        </p>
      </div>
      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40">
        {copiedColor === color.hex ? (
          <Check size={16} />
        ) : (
          <Clipboard size={16} />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-12 text-center text-gray-400 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
        Analizando colores y buscando sus nombres...
      </div>
    );
  }

  if (!palette || !dominantColor) {
    return (
      <div className="mt-12 text-center text-gray-500">
        Sube una imagen para descubrir su magia de colores.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 text-left">
          Color Dominante
        </h2>
        <ColorSwatch color={dominantColor} />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4 text-left">
          Paleta de Colores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {palette.map((color, index) => (
            <ColorSwatch key={index} color={color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
