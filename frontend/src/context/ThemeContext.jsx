import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Theme options: 'light', 'dark', 'system'
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('uit_theme');
        if (saved === 'dark' || saved === 'light' || saved === 'system') {
            return saved;
        }
        return 'system';
    });

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('uit_theme');
        if (saved === 'dark') return true;
        if (saved === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateTheme = () => {
            const systemDark = mediaQuery.matches;
            const activeDark = theme === 'dark' || (theme === 'system' && systemDark);

            setIsDark(activeDark);

            if (activeDark) {
                root.classList.add('dark');
                root.style.colorScheme = 'dark';
            } else {
                root.classList.remove('dark');
                root.style.colorScheme = 'light';
            }
        };

        updateTheme();

        const handleChange = () => {
            if (theme === 'system') {
                updateTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setThemeMode = (mode) => {
        setTheme(mode);
        localStorage.setItem('uit_theme', mode);
    };

    const toggleTheme = () => {
        // Simple toggle between light and dark
        const next = isDark ? 'light' : 'dark';
        setThemeMode(next);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme: setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
