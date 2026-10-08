import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { 
    X, ZoomIn, ZoomOut, RotateCw, Check, Loader2, 
    Crop as CropIcon, Circle, Square
} from 'lucide-react';
import { getCroppedImg } from '../utils/cropUtils';

/**
 * ImageCropModal
 * High-performance interactive image cropper modal powered by react-easy-crop & HTML5 Canvas.
 * Supports zoom, pan, rotate, aspect ratio toggle, circular/rectangular avatar mask.
 */
const ImageCropModal = ({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete: onFinalCrop,
    initialAspect = 1,
    title = 'Crop & Adjust Photo',
    enableCircleMask = true
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(initialAspect);
    const [cropShape, setCropShape] = useState(enableCircleMask ? 'round' : 'rect');
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [processing, setProcessing] = useState(false);

    const onCropChange = (location) => {
        setCrop(location);
    };

    const onZoomChange = (newZoom) => {
        setZoom(newZoom);
    };

    const handleCropComplete = useCallback((croppedArea, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleApply = async () => {
        if (!croppedAreaPixels || !imageSrc) return;
        setProcessing(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            await onFinalCrop(croppedFile);
            onClose();
        } catch (error) {
            console.error('Failed to crop image:', error);
            alert('Failed to crop image: ' + (error?.message || error));
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
                onClick={processing ? undefined : onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <CropIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Drag to position, pinch or use slider to zoom
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        aria-label="Close"
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Main Cropper Canvas Area */}
                <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden select-none">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        cropShape={cropShape}
                        showGrid={true}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={handleCropComplete}
                    />
                </div>

                {/* Controls Bar */}
                <div className="p-5 sm:p-6 bg-gray-50 dark:bg-slate-950/60 space-y-4 border-t border-gray-100 dark:border-slate-800">
                    {/* Zoom & Rotate Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Zoom control */}
                        <div className="flex items-center gap-3 w-full sm:w-2/3">
                            <button
                                type="button"
                                onClick={() => setZoom(prev => Math.max(1, prev - 0.2))}
                                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.05}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none"
                            />
                            <button
                                type="button"
                                onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Rotate & Shape toggle */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                                type="button"
                                onClick={handleRotate}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-slate-300 transition-colors shadow-2xs"
                                title="Rotate 90 degrees"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Rotate</span>
                            </button>

                            {enableCircleMask && (
                                <button
                                    type="button"
                                    onClick={() => setCropShape(prev => prev === 'round' ? 'rect' : 'round')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 text-xs font-semibold text-gray-700 dark:text-slate-300 transition-colors shadow-2xs"
                                    title="Toggle Circle / Square Preview"
                                >
                                    {cropShape === 'round' ? (
                                        <>
                                            <Square className="w-3.5 h-3.5" />
                                            <span>Square</span>
                                        </>
                                    ) : (
                                        <>
                                            <Circle className="w-3.5 h-3.5" />
                                            <span>Circle</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Aspect Ratios & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-200/60 dark:border-slate-800/80">
                        {/* Aspect Ratio Presets */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 mr-1">Aspect:</span>
                            {[
                                { label: '1:1', value: 1 },
                                { label: '4:3', value: 4 / 3 },
                                { label: '16:9', value: 16 / 9 },
                                { label: 'Free', value: undefined }
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => {
                                        setAspect(item.value);
                                        if (item.value !== 1) setCropShape('rect');
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        aspect === item.value
                                            ? 'bg-blue-600 text-white shadow-2xs'
                                            : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-800 hover:border-gray-300'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleApply}
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 active:scale-98 disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Saving Crop...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Apply Crop</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
