import { X } from 'lucide-react';
import JoinForm from './JoinForm';

const JoinModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal Content - slides up on mobile, centered on desktop */}
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-[#1e3a8a]">Join UIT Club</h2>
                        <p className="text-xs sm:text-sm text-[#475569] mt-1">Fill out the form below to apply</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-[#475569]" />
                    </button>
                </div>
                
                {/* Form */}
                <div className="p-4 sm:p-6 md:p-8 pb-8 sm:pb-8">
                    <JoinForm onSuccess={onClose} />
                </div>
            </div>
        </div>
    );
};

export default JoinModal;
