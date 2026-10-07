import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page titles and meta tags
 * Mimics Next.js generateMetadata / Head behavior in React
 */
export const usePageMeta = ({ title, description, image } = {}) => {
    useEffect(() => {
        const previousTitle = document.title;

        if (title) {
            document.title = `${title} | UIT Club — UPF University`;
        }

        if (description) {
            const descMeta = document.querySelector('meta[name="description"]');
            if (descMeta) descMeta.setAttribute('content', description);

            const ogDescMeta = document.querySelector('meta[property="og:description"]');
            if (ogDescMeta) ogDescMeta.setAttribute('content', description);

            const twDescMeta = document.querySelector('meta[name="twitter:description"]');
            if (twDescMeta) twDescMeta.setAttribute('content', description);
        }

        if (title) {
            const ogTitleMeta = document.querySelector('meta[property="og:title"]');
            if (ogTitleMeta) ogTitleMeta.setAttribute('content', `${title} | UIT Club`);

            const twTitleMeta = document.querySelector('meta[name="twitter:title"]');
            if (twTitleMeta) twTitleMeta.setAttribute('content', `${title} | UIT Club`);
        }

        if (image) {
            const ogImgMeta = document.querySelector('meta[property="og:image"]');
            if (ogImgMeta) ogImgMeta.setAttribute('content', image);

            const twImgMeta = document.querySelector('meta[name="twitter:image"]');
            if (twImgMeta) twImgMeta.setAttribute('content', image);
        }

        return () => {
            document.title = previousTitle;
        };
    }, [title, description, image]);
};

export default usePageMeta;
