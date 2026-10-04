import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'Do I need prior coding experience to join UIT Club?',
        answer: 'Not at all. While we have advanced working groups for experienced developers, we actively welcome beginners who demonstrate genuine curiosity and a drive to learn. We organize beginner-friendly bootcamps, peer-learning pods, and guided workshops to help you build solid technical foundations.'
    },
    {
        question: 'Who is eligible to apply for membership?',
        answer: 'Membership is open to any currently enrolled student at Université Ibn Tofail (including UPF, ENSA, Faculté des Sciences, EST, etc.) across all academic levels and majors. If you are passionate about technology, engineering, and collaborative learning, you are eligible to join.'
    },
    {
        question: 'What is the expected weekly time commitment?',
        answer: 'Active members typically dedicate 2 to 4 hours per week. This covers our weekend technical workshops, track meetings, and working on collaborative projects. During hackathons or major event seasons, project squads often choose to spend additional time together.'
    },
    {
        question: 'Are club workshops, events, and hackathon registrations free?',
        answer: 'Yes, 100% free! All our internal workshops, tech talks, mentorship sessions, hackathon preparations, and learning materials are completely free for all accepted members, supported by the club and university partnerships.'
    },
    {
        question: 'What kinds of projects will I get to work on?',
        answer: 'You will build real-world, production-ready software: campus utility platforms, open-source developer tooling, AI models (like our 1st place Google Gemma project), and full-stack web applications. You gain real portfolio projects and GitHub commits that stand out to future employers and internship recruiters.'
    },
    {
        question: 'How does the application and recruitment process work?',
        answer: 'Start by filling out our online registration form. Our executive board reviews your application to understand your motivation and track interests. Shortlisted candidates are invited for a friendly, informal conversation to discuss goals and fit, followed by welcome onboarding into our community channels.'
    }
];

const FAQSection = () => {
    // Collapsed by default like the reference design
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-800/80 transition-colors">
            <div className="reveal-element">
                {/* Header (Centered, Serif title like reference) */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1e293b] dark:text-slate-100 tracking-tight mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Everything you need to know about UIT Club, our technical tracks, and membership applications.
                    </p>
                </div>

                {/* FAQ List Cards */}
                <div className="max-w-4xl mx-auto space-y-3.5 sm:space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    aria-expanded={isOpen}
                                    className="w-full py-5 px-6 sm:px-8 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none select-none"
                                >
                                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-base sm:text-[17px] leading-snug">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-emerald-500 dark:text-emerald-400 stroke-[2.5] flex-shrink-0 transition-transform duration-300 ease-in-out ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out px-6 sm:px-8 overflow-hidden ${
                                        isOpen ? 'max-h-96 pb-6 pt-1 opacity-100' : 'max-h-0 pb-0 pt-0 opacity-0'
                                    }`}
                                >
                                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
