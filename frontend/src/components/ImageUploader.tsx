import { useRef } from 'react';

interface ImageUploaderProps {
    previewUrl: string | null;
    onImageSelected: (file: File) => void;
}

export const ImageUploader = ({ previewUrl, onImageSelected }: ImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelected(file);
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />

            <div
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                ) : (
                    <p>Click to select an image</p>
                )}
            </div>
        </>
    );
};