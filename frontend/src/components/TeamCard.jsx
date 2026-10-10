import { Linkedin, Mail, Globe, Twitter } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const formatUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

const TeamCard = ({ member }) => {
    const { name, role, photo_url, social_links } = member;

    return (
        <div className="group text-center">
            <div className="relative mb-8 mx-auto w-48 h-48 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-blue-900/5 dark:shadow-none">
                <img
                    src={photo_url ? getOptimizedImageUrl(photo_url, 400, 400) : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=400&h=400&q=80'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            
            <h3 className="text-xl font-semibold text-[#1e3a8a] dark:text-white mb-1">{name}</h3>
            <p className="text-xs font-bold text-[#94a3b8] dark:text-slate-400 uppercase tracking-widest mb-4">{role}</p>
            
            <div className="flex justify-center items-center gap-3">
                {social_links?.linkedin && (
                    <a
                        href={formatUrl(social_links.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name}'s LinkedIn`}
                        title="LinkedIn Profile"
                        className="text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-blue-400 transition-colors p-1"
                    >
                        <Linkedin className="w-4 h-4" />
                    </a>
                )}
                {social_links?.website && (
                    <a
                        href={formatUrl(social_links.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name}'s Portfolio`}
                        title="Portfolio / Website"
                        className="text-[#94a3b8] hover:text-[#059669] dark:hover:text-emerald-400 transition-colors p-1"
                    >
                        <Globe className="w-4 h-4" />
                    </a>
                )}
                {social_links?.twitter && (
                    <a
                        href={formatUrl(social_links.twitter)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name}'s Twitter`}
                        title="Twitter Profile"
                        className="text-[#94a3b8] hover:text-[#0284c7] dark:hover:text-sky-400 transition-colors p-1"
                    >
                        <Twitter className="w-4 h-4" />
                    </a>
                )}
                {member.email && (
                    <a
                        href={`mailto:${member.email}`}
                        aria-label={`Email ${name}`}
                        title="Email"
                        className="text-[#94a3b8] hover:text-[#2563eb] dark:hover:text-blue-400 transition-colors p-1"
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default TeamCard;

