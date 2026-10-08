import { useState, useEffect, useRef } from 'react';
import { Upload, X, Loader2, Crop as CropIcon, RefreshCw } from 'lucide-react';
import { uploadToCloudinary } from '../utils/uploadUtils';
import ImageCropModal from './ImageCropModal';

const ImageUpload = ({ 
    onImageUpload, 
    initialImage = '', 
    label = 'Cover Image',
    aspectRatio = 1,
    circularCrop = false,
    enableCrop = true
}) => {
    const [preview, setPreview] = useState(initialImage || '');
    const [uploading, setUploading] = useState(false);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState('');
    const fileInputRef = useRef(null);

    // Sync preview when initialImage loads asynchronously (e.g. edit pages)
    useEffect(() => {
        setPreview(initialImage || '');
    }, [initialImage]);

    // Handle file selection from disk
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, WebP)');
            return;
        }

        // If cropping enabled, open crop modal first
        if (enableCrop) {
            const objectUrl = URL.createObjectURL(file);
            setImageToCrop(objectUrl);
            setIsCropOpen(true);
            // Reset input so re-selecting same file triggers onChange
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            // Direct upload without crop
            uploadFileDirectly(file);
        }
    };

    // Direct upload helper
    const uploadFileDirectly = async (file) => {
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setPreview(url);
            onImageUpload(url);
        } catch (error) {
            alert(`Failed to upload image: ${error}`);
        } finally {
            setUploading(false);
        }
    };

    // Handle cropped file from ImageCropModal
    const handleCropComplete = async (croppedFile) => {
        await uploadFileDirectly(croppedFile);
    };

    // Open cropper on existing image
    const handleCropExisting = () => {
        if (!preview) return;
        setImageToCrop(preview);
        setIsCropOpen(true);
    };

    const handleRemove = () => {
        setPreview('');
        onImageUpload('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {label}
            </label>

            {/* If we have an image, show preview with controls */}
            {preview ? (
                <div className="space-y-3">
                    <div className={`relative w-full ${circularCrop ? 'aspect-square max-w-[220px] mx-auto rounded-3xl' : 'h-52 rounded-2xl'} overflow-hidden group border border-gray-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shadow-xs`}>
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className={`w-full h-full ${circularCrop ? 'object-cover' : 'object-contain'} transition-all`} 
                        />

                        {/* Top-Right Floating Delete Button */}
                        {!uploading && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                title="Remove photo"
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/70 hover:bg-red-600 text-white backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-sm opacity-80 hover:opacity-100 z-10"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}

                        {/* Loading overlay while uploading */}
                        {uploading && (
                            <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-20">
                                <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
                                <span className="text-xs font-medium">Processing & Uploading...</span>
                            </div>
                        )}
                    </div>

                    {/* Clean Action Buttons Below Image */}
                    {!uploading && (
                        <div className="flex items-center gap-2">
                            {enableCrop && (
                                <button
                                    type="button"
                                    onClick={handleCropExisting}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200/60 dark:border-blue-800/40 transition-all cursor-pointer shadow-2xs active:scale-98"
                                >
                                    <CropIcon className="w-3.5 h-3.5" />
                                    <span>Crop Photo</span>
                                </button>
                            )}

                            <label
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer shadow-2xs active:scale-98"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                                <span>Change</span>
                                <input
                                    ref={fileInputRef}
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
            ) : (
                /* Empty Upload Dropzone */
                <div className="flex justify-center items-center w-full">
                    <label className="flex flex-col justify-center items-center w-full h-48 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border-2 border-gray-300 dark:border-slate-800 border-dashed cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-all group">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6 text-gray-500 dark:text-slate-400">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600 dark:text-blue-400" />
                            ) : (
                                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group-hover:scale-105 transition-transform mb-3 shadow-2xs">
                                    <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                            <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-slate-200">
                                {uploading ? 'Processing...' : 'Click to upload photo'}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">
                                {enableCrop ? 'You can crop & rotate before saving' : 'SVG, PNG, JPG, WebP'}
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                            accept="image/*"
                        />
                    </label>
                </div>
            )}

            {/* Interactive Image Crop Modal */}
            <ImageCropModal
                isOpen={isCropOpen}
                onClose={() => setIsCropOpen(false)}
                imageSrc={imageToCrop}
                onCropComplete={handleCropComplete}
                initialAspect={aspectRatio}
                enableCircleMask={circularCrop}
                title={`Crop & Frame ${label}`}
            />
        </div>
    );
};

export default ImageUpload;
