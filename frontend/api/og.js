export const config = {
    runtime: 'edge',
};

function getOptimizedOgImage(url) {
    if (!url) return 'https://www.uit-upf.tech/og-image.jpg';
    if (!url.includes('cloudinary.com')) return url;
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    return `${parts[0]}/upload/w_1200,h_630,c_fill,q_auto,f_auto/${parts[1]}`;
}

function cleanExcerpt(content, maxLength = 160) {
    if (!content) return 'Read this article on UIT Club — UPF University';
    const clean = content
        .replace(/#+\s+/g, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim();
    if (clean.length <= maxLength) return clean;
    return clean.slice(0, maxLength).trim() + '...';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default async function handler(request) {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'article';
    const id = url.searchParams.get('id');

    let title = 'UIT Club — UPF University';
    let description = 'Built by students. Driven by knowledge. A technical collective dedicated to fostering engineering excellence and research collaboration across UPF University.';
    let image = 'https://www.uit-upf.tech/og-image.jpg';
    let canonicalUrl = `https://www.uit-upf.tech/`;

    if (id) {
        try {
            const apiEndpoint = type === 'event'
                ? `https://uit-blog-i5lz.vercel.app/api/v1/events/${encodeURIComponent(id)}`
                : `https://uit-blog-i5lz.vercel.app/api/v1/articles/${encodeURIComponent(id)}`;

            const res = await fetch(apiEndpoint);
            if (res.ok) {
                const json = await res.json();
                const item = json.data;
                if (item) {
                    title = item.title || title;
                    description = type === 'event'
                        ? (item.description ? cleanExcerpt(item.description) : description)
                        : (item.excerpt || (item.content ? cleanExcerpt(item.content) : description));

                    const rawImage = type === 'event' ? item.cover_image_url : item.image_url;
                    image = getOptimizedOgImage(rawImage);

                    canonicalUrl = type === 'event'
                        ? `https://www.uit-upf.tech/events/${id}`
                        : `https://www.uit-upf.tech/articles/${id}`;
                }
            }
        } catch (e) {
            // Silently fall back to default metadata
        }
    }

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImage = escapeHtml(image);
    const safeUrl = escapeHtml(canonicalUrl);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} | UIT Club — UPF University</title>
    <meta name="description" content="${safeDescription}">

    <!-- Open Graph / WhatsApp / Facebook / LinkedIn -->
    <meta property="og:type" content="${type === 'event' ? 'event' : 'article'}">
    <meta property="og:url" content="${safeUrl}">
    <meta property="og:title" content="${safeTitle} | UIT Club">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${safeImage}">
    <meta property="og:image:secure_url" content="${safeImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${safeTitle}">
    <meta property="og:site_name" content="UIT Club">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${safeUrl}">
    <meta name="twitter:title" content="${safeTitle} | UIT Club">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImage}">

    <!-- Seamless fallback redirect if opened in a regular browser -->
    <meta http-equiv="refresh" content="0;url=${safeUrl}">
    <script>window.location.replace("${safeUrl}");</script>
</head>
<body>
    <p>Redirecting to <a href="${safeUrl}">${safeTitle}</a>...</p>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
