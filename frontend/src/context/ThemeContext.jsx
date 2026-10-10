import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Theme options: 'light', 'dark'
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        const saved = localStorage.getItem('uit_theme');
        if (saved === 'dark' || saved === 'light') {
            return saved;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        const saved = localStorage.getItem('uit_theme');
        if (saved === 'dark' || saved === 'light') {
            return saved === 'dark';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;

        const updateTheme = () => {
            const activeDark = theme === 'dark';
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
    }, [theme]);

    const setThemeMode = (mode) => {
        setTheme(mode);
        localStorage.setItem('uit_theme', mode);
    };

    const toggleTheme = () => {
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
