import React, { type ChangeEvent, useRef } from "react";
import { UploadCloud } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  imageUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  imageUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        id="file-upload"
        ref={inputRef}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      {imageUrl ? (
        <div className="w-full text-center">
          <img
            src={imageUrl}
            alt="Vista previa"
            className="max-h-80 rounded-lg shadow-lg mx-auto border-4 border-gray-700"
          />
          <label
            htmlFor="file-upload"
            className="mt-6 inline-block bg-indigo-600 text-white font-bold py-2 px-5 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Cambiar Imagen
          </label>
        </div>
      ) : (
        <div
          onClick={handleAreaClick}
          className="w-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50 transition-colors duration-300"
        >
          <div className="flex flex-col items-center text-gray-400">
            <UploadCloud className="w-16 h-16 mb-4 text-gray-500" />
            <p className="font-semibold text-lg text-gray-300">
              Haz clic para subir o arrastra una imagen
            </p>
            <p className="text-sm">Soporta PNG, JPG, GIF</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
