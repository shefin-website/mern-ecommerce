/**
 * Theme Context for managing light/dark mode
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Theme context
const ThemeContext = createContext();

// Theme constants
export const THEME_MODES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Theme action types
const THEME_ACTIONS = {
    SET_THEME: 'SET_THEME',
    TOGGLE_THEME: 'TOGGLE_THEME'
};

// Theme reducer
const themeReducer = (state, action) => {
    switch (action.type) {
        case THEME_ACTIONS.SET_THEME:
            return {
                ...state,
                mode: action.payload
            };
        case THEME_ACTIONS.TOGGLE_THEME:
            return {
                ...state,
                mode: state.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
            };
        default:
            return state;
    }
};

// Initial state
const initialState = {
    mode: THEME_MODES.LIGHT
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, initialState);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const initializeTheme = () => {
            // Check localStorage first
            const savedTheme = localStorage.getItem('theme-mode');
            if (savedTheme && Object.values(THEME_MODES).includes(savedTheme)) {
                dispatch({ type: THEME_ACTIONS.SET_THEME, payload: savedTheme });
                applyTheme(savedTheme);
                return;
            }

            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                dispatch({ type: THEME_ACTIONS.SET_THEME, payload: THEME_MODES.DARK });
                applyTheme(THEME_MODES.DARK);
                return;
            }

            // Default to light mode
            applyTheme(THEME_MODES.LIGHT);
        };

        initializeTheme();
    }, []);

    // Apply theme to document body
    const applyTheme = (theme) => {
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
    };

    // Save theme to localStorage and apply it
    const setTheme = (theme) => {
        localStorage.setItem('theme-mode', theme);
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
        applyTheme(theme);
    };

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = state.mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        setTheme(newTheme);
    };

    const value = {
        mode: state.mode,
        isLightMode: state.mode === THEME_MODES.LIGHT,
        isDarkMode: state.mode === THEME_MODES.DARK,
        setTheme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;