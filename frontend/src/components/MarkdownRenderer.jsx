import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const slugify = (text = '') => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const renderInline = (text) => {
    if (!text) return '';

    // Check for inline images: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    let remaining = text;
    let keyIdx = 0;

    // Process images first
    const partsWithImg = [];
    let lastImgIdx = 0;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(remaining)) !== null) {
        if (imgMatch.index > lastImgIdx) {
            partsWithImg.push({ type: 'text', content: remaining.substring(lastImgIdx, imgMatch.index) });
        }
        partsWithImg.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
        lastImgIdx = imgMatch.index + imgMatch[0].length;
    }
    if (lastImgIdx < remaining.length) {
        partsWithImg.push({ type: 'text', content: remaining.substring(lastImgIdx) });
    }

    return partsWithImg.map((item, pIdx) => {
        if (item.type === 'image') {
            return (
                <span key={`img-${pIdx}`} className="block my-4">
                    <img
                        src={item.src}
                        alt={item.alt || 'Article image'}
                        className="rounded-2xl max-w-full h-auto mx-auto shadow-md border border-slate-200 dark:border-slate-800"
                        loading="lazy"
                    />
                    {item.alt && (
                        <span className="block text-center text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                            {item.alt}
                        </span>
                    )}
                </span>
            );
        }

        // Process links: [text](url)
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        let lastLinkIdx = 0;
        let linkMatch;
        const linkParts = [];
        const subText = item.content;

        while ((linkMatch = linkRegex.exec(subText)) !== null) {
            if (linkMatch.index > lastLinkIdx) {
                linkParts.push({ type: 'text', content: subText.substring(lastLinkIdx, linkMatch.index) });
            }
            linkParts.push({ type: 'link', text: linkMatch[1], href: linkMatch[2] });
            lastLinkIdx = linkMatch.index + linkMatch[0].length;
        }
        if (lastLinkIdx < subText.length) {
            linkParts.push({ type: 'text', content: subText.substring(lastLinkIdx) });
        }

        return linkParts.map((part) => {
            if (part.type === 'link') {
                return (
                    <a
                        key={`link-${keyIdx++}`}
                        href={part.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium"
                    >
                        {part.text}
                    </a>
                );
            }

            // Sub-parse inline code (`code`), bold (**bold**), and italic (*italic*)
            const subTokens = part.content.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
            return subTokens.map((token, subIdx) => {
                if (token.startsWith('`') && token.endsWith('`')) {
                    return (
                        <code
                            key={`code-${keyIdx++}-${subIdx}`}
                            className="px-1.5 py-0.5 mx-0.5 bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-mono text-xs rounded border border-slate-200 dark:border-slate-700"
                        >
                            {token.slice(1, -1)}
                        </code>
                    );
                }
                if (token.startsWith('**') && token.endsWith('**')) {
                    return (
                        <strong key={`bold-${keyIdx++}-${subIdx}`} className="font-bold text-slate-900 dark:text-white">
                            {token.slice(2, -2)}
                        </strong>
                    );
                }
                if (token.startsWith('*') && token.endsWith('*')) {
                    return (
                        <em key={`em-${keyIdx++}-${subIdx}`} className="italic text-slate-800 dark:text-slate-200">
                            {token.slice(1, -1)}
                        </em>
                    );
                }
                return token;
            });
        });
    });
};

const MarkdownRenderer = ({ content = '' }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (!content || !content.trim()) {
        return (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm italic">
                No content to preview yet. Switch to the &ldquo;Write&rdquo; tab to start drafting.
            </div>
        );
    }

    const handleCopy = async (code, index) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const lines = content.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let codeLang = '';
    let codeCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block toggle
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                const fullCode = codeBuffer.join('\n');
                const idx = codeCount++;
                elements.push(
                    <div key={`code-block-${i}`} className="my-5 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-100 shadow-md">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-800 text-xs font-mono text-slate-400">
                            <span>{codeLang || 'code'}</span>
                            <button
                                type="button"
                                onClick={() => handleCopy(fullCode, idx)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
                            >
                                {copiedIndex === idx ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-blue-200">
                            <code>{fullCode}</code>
                        </pre>
                    </div>
                );
                codeBuffer = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeLang = line.replace('```', '').trim();
            }
            continue;
        }

        if (inCodeBlock) {
            codeBuffer.push(line);
            continue;
        }

        const trimmed = line.trim();

        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
            elements.push(<hr key={`hr-${i}`} className="my-8 border-t border-slate-200 dark:border-slate-800" />);
            continue;
        }

        // Headings with Anchor Slug IDs
        if (line.startsWith('# ')) {
            const raw = line.replace('# ', '');
            elements.push(
                <h1 key={`h1-${i}`} id={slugify(raw)} className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-8 mb-4 tracking-tight leading-snug scroll-mt-24">
                    {renderInline(raw)}
                </h1>
            );
            continue;
        }
        if (line.startsWith('## ')) {
            const raw = line.replace('## ', '');
            elements.push(
                <h2 key={`h2-${i}`} id={slugify(raw)} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3.5 pb-2 border-b border-slate-100 dark:border-slate-800 tracking-tight leading-snug scroll-mt-24">
                    {renderInline(raw)}
                </h2>
            );
            continue;
        }
        if (line.startsWith('### ')) {
            const raw = line.replace('### ', '');
            elements.push(
                <h3 key={`h3-${i}`} id={slugify(raw)} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5 tracking-tight leading-snug scroll-mt-24">
                    {renderInline(raw)}
                </h3>
            );
            continue;
        }
        if (line.startsWith('#### ')) {
            const raw = line.replace('#### ', '');
            elements.push(
                <h4 key={`h4-${i}`} id={slugify(raw)} className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2 leading-snug scroll-mt-24">
                    {renderInline(raw)}
                </h4>
            );
            continue;
        }

        // Blockquotes
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={`quote-${i}`} className="my-5 pl-4 py-2.5 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 rounded-r-xl italic text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {renderInline(line.replace('> ', ''))}
                </blockquote>
            );
            continue;
        }

        // Bullet Lists (- or *)
        if (line.startsWith('- ') || line.startsWith('* ')) {
            elements.push(
                <li key={`li-${i}`} className="ml-5 my-1.5 text-slate-700 dark:text-slate-300 text-sm sm:text-base list-disc leading-relaxed">
                    {renderInline(line.substring(2))}
                </li>
            );
            continue;
        }

        // Numbered Lists
        if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+)\.\s(.*)/);
            if (match) {
                elements.push(
                    <div key={`ol-${i}`} className="flex items-start gap-3 my-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center mt-0.5 border border-blue-200 dark:border-blue-800">
                            {match[1]}
                        </span>
                        <div className="flex-1">{renderInline(match[2])}</div>
                    </div>
                );
                continue;
            }
        }

        // Empty lines
        if (trimmed === '') {
            elements.push(<div key={`empty-${i}`} className="h-3"></div>);
            continue;
        }

        // Regular Paragraph
        elements.push(
            <p key={`p-${i}`} className="mb-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {renderInline(line)}
            </p>
        );
    }

    return <div className="markdown-preview leading-relaxed font-sans">{elements}</div>;
};

export default MarkdownRenderer;
