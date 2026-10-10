/**
 * Ultra-lightweight User-Agent & Referrer Parser (Zero Dependencies)
 */
const parseUserAgent = (ua = '') => {
    let deviceType = 'desktop';
    let browser = 'Other';
    let os = 'Other';

    if (!ua || typeof ua !== 'string') {
        return { deviceType, browser, os };
    }

    // 1. Device Type
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceType = 'tablet';
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
        deviceType = 'mobile';
    } else {
        deviceType = 'desktop';
    }

    // 2. Browser
    if (/Brave/i.test(ua)) {
        browser = 'Brave';
    } else if (/Arc/i.test(ua)) {
        browser = 'Arc';
    } else if (/SamsungBrowser/i.test(ua)) {
        browser = 'Samsung Internet';
    } else if (/Vivaldi/i.test(ua)) {
        browser = 'Vivaldi';
    } else if (/DuckDuckGo/i.test(ua)) {
        browser = 'DuckDuckGo';
    } else if (/Edg\/|Edge\//i.test(ua)) {
        browser = 'Edge';
    } else if (/OPR\/|Opera/i.test(ua)) {
        browser = 'Opera';
    } else if (/Chrome\/|CriOS\//i.test(ua) && !/Edg|OPR|Samsung|Vivaldi|Arc|Brave/i.test(ua)) {
        browser = 'Chrome';
    } else if (/Safari\//i.test(ua) && !/Chrome|CriOS|Android|Samsung|Edge/i.test(ua)) {
        browser = 'Safari';
    } else if (/Firefox\/|FxiOS\//i.test(ua)) {
        browser = 'Firefox';
    } else if (/MSIE|Trident\//i.test(ua)) {
        browser = 'Internet Explorer';
    } else {
        browser = 'Other';
    }

    // 3. Operating System
    if (/iPhone|iPad|iPod/i.test(ua)) {
        os = 'iOS';
    } else if (/Android/i.test(ua)) {
        os = 'Android';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        os = 'macOS';
    } else if (/Windows NT/i.test(ua)) {
        os = 'Windows';
    } else if (/Linux/i.test(ua)) {
        os = 'Linux';
    } else {
        os = 'Other';
    }

    return { deviceType, browser, os };
};

const parseReferrer = (referrerUrl = '', host = '') => {
    if (!referrerUrl || typeof referrerUrl !== 'string' || referrerUrl.trim() === '') {
        return 'Direct';
    }

    try {
        const url = new URL(referrerUrl);
        const refHost = url.hostname.toLowerCase();

        if (host && refHost.includes(host.toLowerCase())) {
            return 'Internal';
        }

        if (refHost.includes('instagram.com') || refHost.includes('l.instagram.com')) return 'Instagram';
        if (refHost.includes('linkedin.com') || refHost.includes('lnkd.in')) return 'LinkedIn';
        if (refHost.includes('google.') || refHost.includes('googleusercontent.com')) return 'Google';
        if (refHost.includes('t.co') || refHost.includes('twitter.com') || refHost.includes('x.com')) return 'Twitter / X';
        if (refHost.includes('facebook.com') || refHost.includes('fb.com') || refHost.includes('m.facebook.com')) return 'Facebook';
        if (refHost.includes('whatsapp.com') || refHost.includes('api.whatsapp.com')) return 'WhatsApp';
        if (refHost.includes('youtube.com') || refHost.includes('youtu.be')) return 'YouTube';
        if (refHost.includes('github.com')) return 'GitHub';
        if (refHost.includes('upf.ac.ma') || refHost.includes('upf.tech')) return 'UPF University';
        if (refHost.includes('localhost') || refHost.includes('127.0.0.1')) return 'Direct / Local';

        return refHost.replace(/^www\./, '');
    } catch {
        return 'Direct';
    }
};

module.exports = {
    parseUserAgent,
    parseReferrer
};
