import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import settingsService from '../services/settingsService';

/**
 * Announcement Pop-up Modal
 * Automatically displays when an active announcement exists.
 * Displays full uncropped poster image with clean styling consistent with the brand.
 * Remembers dismissal in sessionStorage so visitors aren't interrupted repeatedly.
 */
const AnnouncementModal = () => {
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAnnouncement = async () => {
            try {
                const res = await settingsService.getAnnouncement();
                const data = res?.data?.data || res?.data;

                if (!isMounted || !data || !data.is_active || !data.poster_url) {
                    return;
                }

                // Create a unique dismissal key based on poster or title so new announcements show up
                const dismissKey = `uit_announcement_seen_${data.poster_url}_${data.title || ''}`;
                const hasDismissed = sessionStorage.getItem(dismissKey);

                if (!hasDismissed) {
                    setAnnouncement(data);
                    // Smooth appearance after initial page paint
                    const timer = setTimeout(() => {
                        if (isMounted) setIsOpen(true);
                    }, 500);
                    return () => clearTimeout(timer);
                }
            } catch (err) {
                console.debug('Announcement check:', err?.message);
            }
        };

        checkAnnouncement();
        return () => { isMounted = false; };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        if (announcement) {
            const dismissKey = `uit_announcement_seen_${announcement.poster_url}_${announcement.title || ''}`;
            sessionStorage.setItem(dismissKey, 'true');
        }
    };

    // Close on Escape key & lock scroll when modal is open
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen]);

    if (!isOpen || !announcement) return null;

    const handleActionClick = () => {
        handleClose();
        if (announcement.link_url) {
            if (announcement.link_url.startsWith('http')) {
                window.open(announcement.link_url, '_blank', 'noopener,noreferrer');
            } else {
                navigate(announcement.link_url);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop with modern glassmorphism blur - covers full screen including navbar */}
            <div
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Card: Fits poster naturally without cropping */}
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 transform scale-100 animate-in zoom-in-95 duration-200 flex flex-col"
            >
                {/* Floating Close Button */}
                <button
                    onClick={handleClose}
                    aria-label="Close Announcement"
                    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg border border-white/10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Full Poster Image (Full-bleed, uncropped natural aspect ratio) */}
                <div
                    onClick={announcement.link_url ? handleActionClick : undefined}
                    className={`relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950 ${
                        announcement.link_url ? 'cursor-pointer group' : ''
                    }`}
                >
                    <img
                        src={announcement.poster_url}
                        alt={announcement.title || 'Announcement Poster'}
                        className="w-full h-auto max-h-[78vh] object-contain mx-auto block transition-transform duration-500 group-hover:scale-[1.01]"
                    />

                    {/* Subtle hover indicator if clickable */}
                    {announcement.link_url && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                            <span className="text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span>Click to open</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    )}
                </div>

                {/* Optional Footer: only if title or button exists */}
                {(announcement.title || announcement.link_url) && (
                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                        {announcement.title ? (
                            <h3 className="text-sm sm:text-base font-bold text-[#1e3a8a] dark:text-white leading-snug line-clamp-1 flex-1">
                                {announcement.title}
                            </h3>
                        ) : (
                            <span className="flex-1" />
                        )}

                        {announcement.link_url && (
                            <button
                                onClick={handleActionClick}
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer shrink-0"
                            >
                                <span>{announcement.button_text || 'View Details'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementModal;
