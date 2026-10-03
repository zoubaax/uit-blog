import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const renderInline = (text) => {
    if (!text) return '';

    // Regex pattern for bold (**), italic (*), inline code (`), and links ([text](url))
    const tokens = [];
    let remaining = text;
    let keyIdx = 0;

    // Process links first: [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    let lastIndex = 0;
    let match;

    const parts = [];
    while ((match = linkRegex.exec(remaining)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: remaining.substring(lastIndex, match.index) });
        }
        parts.push({ type: 'link', text: match[1], href: match[2] });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < remaining.length) {
        parts.push({ type: 'text', content: remaining.substring(lastIndex) });
    }

    return parts.map((part) => {
        if (part.type === 'link') {
            return (
                <a
                    key={`link-${keyIdx++}`}
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                    {part.text}
                </a>
            );
        }

        // Sub-parse inline code, bold, italic
        const subTokens = part.content.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return subTokens.map((token, subIdx) => {
            if (token.startsWith('`') && token.endsWith('`')) {
                return (
                    <code
                        key={`code-${keyIdx++}-${subIdx}`}
                        className="px-1.5 py-0.5 mx-0.5 bg-slate-100 text-blue-700 font-mono text-xs rounded border border-slate-200"
                    >
                        {token.slice(1, -1)}
                    </code>
                );
            }
            if (token.startsWith('**') && token.endsWith('**')) {
                return (
                    <strong key={`bold-${keyIdx++}-${subIdx}`} className="font-bold text-slate-900">
                        {token.slice(2, -2)}
                    </strong>
                );
            }
            if (token.startsWith('*') && token.endsWith('*')) {
                return (
                    <em key={`em-${keyIdx++}-${subIdx}`} className="italic text-slate-800">
                        {token.slice(1, -1)}
                    </em>
                );
            }
            return token;
        });
    });
};

const MarkdownRenderer = ({ content = '' }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (!content || !content.trim()) {
        return (
            <div className="text-center py-16 text-slate-400 text-sm italic">
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
            elements.push(<hr key={`hr-${i}`} className="my-8 border-t-2 border-slate-200/80" />);
            continue;
        }

        // Headings
        if (line.startsWith('# ')) {
            elements.push(
                <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black text-slate-900 mt-8 mb-4 tracking-tight leading-snug">
                    {renderInline(line.replace('# ', ''))}
                </h1>
            );
            continue;
        }
        if (line.startsWith('## ')) {
            elements.push(
                <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-slate-900 mt-7 mb-3 pb-2 border-b border-slate-100 tracking-tight leading-snug">
                    {renderInline(line.replace('## ', ''))}
                </h2>
            );
            continue;
        }
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2.5 tracking-tight leading-snug">
                    {renderInline(line.replace('### ', ''))}
                </h3>
            );
            continue;
        }
        if (line.startsWith('#### ')) {
            elements.push(
                <h4 key={`h4-${i}`} className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2 leading-snug">
                    {renderInline(line.replace('#### ', ''))}
                </h4>
            );
            continue;
        }

        // Blockquotes
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={`quote-${i}`} className="my-4 pl-4 py-2 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-xl italic text-slate-700 text-sm leading-relaxed">
                    {renderInline(line.replace('> ', ''))}
                </blockquote>
            );
            continue;
        }

        // Bullet Lists (- or *)
        if (line.startsWith('- ') || line.startsWith('* ')) {
            elements.push(
                <li key={`li-${i}`} className="ml-5 my-1.5 text-slate-700 text-sm list-disc leading-relaxed">
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
                    <div key={`ol-${i}`} className="flex items-start gap-2.5 my-2 text-slate-700 text-sm leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5">
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
            <p key={`p-${i}`} className="mb-3 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                {renderInline(line)}
            </p>
        );
    }

    return <div className="markdown-preview leading-relaxed font-sans">{elements}</div>;
};

export default MarkdownRenderer;
