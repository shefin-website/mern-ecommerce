/**
 * Theme Toggle Component
 * Toggles between light and dark mode
 */

import React from 'react';
import { useTheme } from '../../../contexts/Theme';
import Button from '../Button';

const ThemeToggle = ({ className = '' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const handleToggle = () => {
        toggleTheme();
    };

    // Sun icon for light mode (when in dark mode, show sun to switch to light)
    const SunIcon = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );

    // Moon icon for dark mode (when in light mode, show moon to switch to dark)
    const MoonIcon = () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );

    return (
        <Button
            borderless
            variant="empty"
            className={`theme-toggle ${className}`}
            ariaLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
            onClick={handleToggle}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        />
    );
};

export default ThemeToggle;