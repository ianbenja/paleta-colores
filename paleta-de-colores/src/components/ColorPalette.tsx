import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface ColorPaletteProps {
  palette: string[] | null;
  dominantColor: string | null;
  loading: boolean;
}

interface ColorSwatchProps {
  color: string;
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
      className="relative rounded-lg h-28 flex items-center justify-center cursor-pointer group transition-transform transform hover:scale-105 shadow-lg"
      style={{ backgroundColor: color }}
      onClick={() => copyToClipboard(color)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
        <span className="text-white font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
          {color}
        </span>
        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40">
          {copiedColor === color ? (
            <Check size={16} />
          ) : (
            <Clipboard size={16} />
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-12 text-center text-gray-400 flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
        Extrayendo colores...
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
