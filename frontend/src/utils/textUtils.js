/**
 * Strips Markdown formatting characters to produce a clean plain-text excerpt.
 * Prevents markdown syntax like '#', '**', images, and links from showing in card summaries.
 */
export const cleanMarkdownExcerpt = (text = '', maxLength = 140) => {
    if (!text) return '';
    const plain = text
        .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links, keep text
        .replace(/#+\s*/g, '') // remove heading hashes like '# ', '## '
        .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
        .replace(/\*(.*?)\*/g, '$1') // remove italics
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // remove code
        .replace(/^>\s*/gm, '') // remove blockquotes
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return plain.length > maxLength ? plain.substring(0, maxLength).trim() + '...' : plain;
};
