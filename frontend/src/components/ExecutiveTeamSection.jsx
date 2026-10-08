import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin, Globe, Mail } from 'lucide-react';
import teamService from '../services/teamService';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';
const FALLBACK_AVATARS = {
    sg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    president: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    vp: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
};

/**
 * Dynamic Executive Team Section for Landing Page
 * Displays the 3 key leaders dynamically from the database:
 * - Left: Secrétaire Général (SG)
 * - Middle: Présidente / President
 * - Right: Vice-Président / VP
 *
 * Style: Interlocking circular frames, dark borders, bold uppercase typography
 */
const ExecutiveTeamSection = ({ members: propMembers, loading: propLoading }) => {
    const [members, setMembers] = useState(propMembers || []);
    const [loading, setLoading] = useState(propLoading ?? !propMembers);

    useEffect(() => {
        if (propMembers !== undefined) {
            setMembers(propMembers);
            setLoading(propLoading ?? false);
            return;
        }

        let isMounted = true;
        const fetchTeam = async () => {
            try {
                const res = await teamService.getAll();
                if (isMounted) {
                    setMembers(res?.data || []);
                }
            } catch (err) {
                console.error('Failed to load team for executive section:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTeam();
        return () => { isMounted = false; };
    }, [propMembers, propLoading]);

    // Defaults / Fallback team if not populated yet in DB
    const defaultTrio = {
        sg: {
            id: 'fallback-sg',
            name: 'ADNANE EL MENOUAR',
            role: 'Secrétaire Général',
            image: FALLBACK_AVATARS.sg,
            social_links: {}
        },
        president: {
            id: 'fallback-president',
            name: 'AYA BOUHSINI',
            role: 'Présidente',
            image: FALLBACK_AVATARS.president,
            social_links: {}
        },
        vp: {
            id: 'fallback-vp',
            name: 'MOHAMMED ZOUBAA',
            role: 'Vice-Président',
            image: FALLBACK_AVATARS.vp,
            social_links: {
                linkedin: 'https://www.linkedin.com/in/zoubaa-mohammed/',
                website: 'https://zoubaa.dev/'
            }
        }
    };

    // Helper to resolve the best image for a member
    const resolvePhoto = (member, fallbackImage) => {
        if (member?.photo_url) {
            return getOptimizedImageUrl(member.photo_url, 400, 400);
        }
        return fallbackImage;
    };

    // Dynamically match President, VP, and SG from the fetched team list
    const resolveExecutiveTrio = () => {
        if (!members || members.length === 0) {
            return [
                { ...defaultTrio.sg, position: 'left', zIndex: 'z-10' },
                { ...defaultTrio.president, position: 'middle', zIndex: 'z-20', isPresident: true },
                { ...defaultTrio.vp, position: 'right', zIndex: 'z-10' }
            ];
        }

        // 1. Identify President (matches 'presid' in role)
        const presidentMember = members.find(m => /presid/i.test(m.role || ''))
            || members.find(m => /bouhsini|aya/i.test(m.name || ''));

        // 2. Identify VP (matches 'vice' or 'vp' or 'zoubaa' or Community/VP)
        const vpMember = members.find(m => /(vice|vp\b|v\.p)/i.test(m.role || ''))
            || members.find(m => /zoubaa/i.test(m.name || ''));

        // 3. Identify SG (matches 'secr' or 'sg' or 'general secretary' or 'adnane')
        const sgMember = members.find(m => /(secr[eé]t|sg\b)/i.test(m.role || ''))
            || members.find(m => /menouar|adnane/i.test(m.name || ''));

        // Map to final 3 positions
        const sg = {
            id: sgMember?.id || defaultTrio.sg.id,
            name: (sgMember?.name || defaultTrio.sg.name).toUpperCase(),
            role: 'Secrétaire Général',
            image: resolvePhoto(sgMember, defaultTrio.sg.image),
            fallbackImage: defaultTrio.sg.image,
            social_links: sgMember?.social_links || {},
            position: 'left',
            zIndex: 'z-10',
        };

        const president = {
            id: presidentMember?.id || defaultTrio.president.id,
            name: (presidentMember?.name || defaultTrio.president.name).toUpperCase(),
            role: 'Présidente',
            image: resolvePhoto(presidentMember, defaultTrio.president.image),
            fallbackImage: defaultTrio.president.image,
            social_links: presidentMember?.social_links || {},
            position: 'middle',
            zIndex: 'z-20',
            isPresident: true,
        };

        const vp = {
            id: vpMember?.id || defaultTrio.vp.id,
            name: (vpMember?.name || defaultTrio.vp.name).toUpperCase(),
            role: 'Vice-Président',
            image: resolvePhoto(vpMember, defaultTrio.vp.image),
            fallbackImage: defaultTrio.vp.image,
            social_links: vpMember?.social_links || defaultTrio.vp.social_links,
            position: 'right',
            zIndex: 'z-10',
        };

        return [sg, president, vp];
    };

    const executiveTrio = resolveExecutiveTrio();

    return (
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
            
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 reveal-element">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        Meet the Team
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                        Guiding UIT Club with a shared commitment to academic excellence, engineering leadership, and student innovation.
                    </p>
                </div>

                {/* Overlapping Circles Layout */}
                <div className="flex flex-col items-center justify-center reveal-element">
                    {loading ? (
                        <div className="flex items-center justify-center -space-x-8 sm:-space-x-14 py-8 animate-pulse">
                            {[1, 2, 3].map((n) => (
                                <div
                                    key={n}
                                    className="w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full bg-slate-200/80 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center -space-x-8 sm:-space-x-12 md:-space-x-16 lg:-space-x-20 py-4 sm:py-6">
                            {executiveTrio.map((leader) => (
                                <div
                                    key={leader.id}
                                    className={`group flex flex-col items-center transition-all duration-300 ease-out hover:z-30 hover:-translate-y-2 ${leader.zIndex}`}
                                >
                                    {/* Circular Portrait Frame */}
                                    <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-[3.5px] sm:border-[4.5px] border-slate-950 dark:border-slate-800 shadow-xl shadow-slate-900/15 dark:shadow-black/50 transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-600 dark:group-hover:border-blue-500">
                                        <img
                                            src={leader.image}
                                            alt={leader.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                // If database Cloudinary url fails, fallback to cropped asset
                                                if (leader.fallbackImage && e.target.src !== leader.fallbackImage) {
                                                    e.target.src = leader.fallbackImage;
                                                }
                                            }}
                                        />
                                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 pointer-events-none" />
                                    </div>

                                    {/* Name and Role */}
                                    <div className="text-center mt-4 sm:mt-6 px-1 max-w-[140px] sm:max-w-[200px] md:max-w-[240px]">
                                        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-tight sm:tracking-wide text-slate-900 dark:text-white uppercase transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {leader.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm md:text-base font-medium text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1">
                                            {leader.role}
                                        </p>

                                        {/* Optional Social Icon if available */}
                                        {leader.social_links?.linkedin && (
                                            <a
                                                href={leader.social_links.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${leader.name} LinkedIn`}
                                                className="inline-flex items-center justify-center mt-2 w-6 h-6 rounded-full text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <Linkedin className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View Entire Team CTA */}
                    <div className="mt-12 sm:mt-14 text-center">
                        <Link
                            to="/team"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs hover:shadow-md transition-all duration-200 group"
                        >
                            <span>Meet the Entire Team</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExecutiveTeamSection;
