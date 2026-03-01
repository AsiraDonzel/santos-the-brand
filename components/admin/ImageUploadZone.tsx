import React, { useCallback, useState } from "react";
import { UploadCloud, X } from "lucide-react";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadZoneProps {
  label: string;
  value: string;
  setImages: (updater: (prev: ImageFile[]) => ImageFile[]) => void;
  multiple?: boolean;
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  label,
  value,
  setImages,
  multiple = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length > 0) {
      processFiles(multiple ? files : [files[0]]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length > 0) {
        processFiles(multiple ? files : [files[0]]);
      }
    }
  };

  const processFiles = useCallback(
    (files: File[]) => {
      const newImages: ImageFile[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      // Show local preview for all zones
      if (newImages.length > 0) {
        setLocalPreview(newImages[0].preview);
      }

      if (multiple) {
        setImages((prev: ImageFile[]) => [...prev, ...newImages]);
      } else {
        // Replace instead of appending for single-image zones
        setImages((prev: ImageFile[]) => {
          // Keep only images from other upload zones
          return [
            ...prev.filter((img) => !img.id.startsWith(label)),
            ...newImages.map((img) => ({ ...img, id: `${label}-${img.id}` })),
          ];
        });
      }
    },
    [setImages, multiple, label],
  );

  const displayValue = localPreview || value;

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-sm transition-colors cursor-pointer ${isDragging ? "border-primary-600 bg-primary-50" : "border-slate-300 hover:border-primary-400 bg-slate-50"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
      >
        <div className="space-y-1 text-center flex flex-col items-center">
          {displayValue ? (
            <div className="relative group">
              <img
                src={displayValue}
                alt="Preview"
                className="h-24 w-auto object-contain rounded-sm"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                  Change
                </p>
              </div>
            </div>
          ) : (
            <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
          )}
          <div className="flex text-sm text-slate-600 mt-2">
            <label
              htmlFor={`file-upload-${label}`}
              className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                {displayValue ? (multiple ? "Add more / Change" : "Change Image") : "Upload a file"}
              </span>
              <input
                id={`file-upload-${label}`}
                name={`file-upload-${label}`}
                type="file"
                className="sr-only"
                accept="image/*"
                multiple={multiple}
                onChange={handleChange}
              />
            </label>
            {!displayValue && (
              <p className="pl-1 text-xs text-slate-500">or drag and drop</p>
            )}
          </div>
          {!displayValue && (
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              PNG, JPG, GIF up to 10MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadZone;
