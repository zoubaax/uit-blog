import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, AlertCircle, X, Loader2 } from 'lucide-react';

/**
 * Modern In-App Confirmation Modal
 * Replaces ugly native browser window.confirm with a sleek, branded dialog.
 */
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger', // 'danger' | 'warning' | 'primary'
    loading = false,
    itemPreview = null
}) => {
    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !loading) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50',
            button: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-98',
            Icon: Trash2
        },
        warning: {
            iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50',
            button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 active:scale-98',
            Icon: AlertTriangle
        },
        primary: {
            iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50',
            button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-98',
            Icon: AlertCircle
        }
    };

    const currentVariant = variantStyles[variant] || variantStyles.danger;
    const { Icon, iconBg, button } = currentVariant;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
                onClick={loading ? undefined : onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 dark:border-slate-800 transition-all transform scale-100 animate-in zoom-in-95 duration-200"
            >
                {/* Close 'X' button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="space-y-4">
                    {/* Header Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                        <Icon className="w-6 h-6" />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Optional Item Preview */}
                    {itemPreview && (
                        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-950/60 border border-gray-100 dark:border-slate-800/80">
                            {itemPreview}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50 ${button}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <span>{confirmText}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
