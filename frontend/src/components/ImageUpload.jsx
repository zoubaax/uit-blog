import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../utils/uploadUtils';

const ImageUpload = ({ onImageUpload, initialImage }) => {
    const [preview, setPreview] = useState(initialImage || '');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setPreview(url);
            onImageUpload(url); // Pass URL back to parent form
        } catch (error) {
            alert(`Failed to upload image: ${error}`);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onImageUpload('');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>

            {/* If we have an image, show preview */}
            {preview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-gray-200">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center w-full">
                    <label className="flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6 text-gray-500">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600" />
                            ) : (
                                <Upload className="w-8 h-8 mb-3" />
                            )}
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG (MAX. 2MB)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                            accept="image/*"
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
