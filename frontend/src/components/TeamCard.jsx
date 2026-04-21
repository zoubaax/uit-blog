import { Linkedin, Mail } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/cloudinaryUtils';

const TeamCard = ({ member }) => {
    const { name, role, photo_url, social_links } = member;

    return (
        <div className="group text-center">
            <div className="relative mb-8 mx-auto w-48 h-48 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xl shadow-blue-900/5">
                <img
                    src={photo_url ? getOptimizedImageUrl(photo_url, 400, 400) : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=400&h=400&q=80'}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            
            <h3 className="text-xl font-semibold text-[#1e3a8a] mb-1">{name}</h3>
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest mb-4">{role}</p>
            
            <div className="flex justify-center gap-3">
                {social_links?.linkedin && (
                    <a href={social_links.linkedin} className="text-[#94a3b8] hover:text-[#2563eb] transition-colors">
                        <Linkedin className="w-4 h-4" />
                    </a>
                )}
                {member.email && (
                    <a href={`mailto:${member.email}`} className="text-[#94a3b8] hover:text-[#2563eb] transition-colors">
                        <Mail className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default TeamCard;

