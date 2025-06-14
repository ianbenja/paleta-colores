import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import ColorPalette from "./components/ColorPalette";
import { useColorThief } from "./hooks/useColorThief";
// No se necesita más App.css

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { palette, dominantColor, loading } = useColorThief(imageUrl, 10);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-indigo-600">
            Generador de Paletas de Colores
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Descubre la paleta de colores oculta en cualquier imagen con un solo
            clic.
          </p>
        </header>

        <main className="flex flex-col items-center">
          <ImageUploader onImageUpload={setImageUrl} imageUrl={imageUrl} />
          <ColorPalette
            palette={palette}
            dominantColor={dominantColor}
            loading={loading}
          />
        </main>

        <footer className="text-center mt-20 text-gray-500 border-t border-gray-800 pt-6">
          <p>Hecho con ❤️, React y Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
