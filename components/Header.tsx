
import React, { useState, useEffect, useRef } from 'react';
import { FileText, Loader2, User, LogOut, Sparkles, Palette } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
    title: string;
    showActions: boolean;
    isExporting: boolean;
    onInitiateExport: (exportType: 'kpis-only' | 'with-details') => void;
    onLogout: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const THEMES: { id: Theme; name: string }[] = [
    { id: 'system', name: 'System' },
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'forest', name: 'Forest' },
    { id: 'cosmic', name: 'Cosmic' },
    { id: 'blush', name: 'Blush' },
];

const Header: React.FC<HeaderProps> = ({ title, showActions, isExporting, onInitiateExport, onLogout, theme, setTheme }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const themeDropdownRef = useRef<HTMLDivElement>(null);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(prev => !prev);
    };

    const handleProfileOption = () => {
        alert('Profile management is not yet implemented.');
        setIsProfileDropdownOpen(false);
    };

    const handleLogoutOption = () => {
        onLogout();
        setIsProfileDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
                setIsExportDropdownOpen(false);
            }
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
                setIsThemeDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleExportClick = (exportType: 'kpis-only' | 'with-details') => {
        onInitiateExport(exportType);
        setIsExportDropdownOpen(false);
    }
    
    const headerBorder = 'border-slate-200 dark:border-white/20';
    const titleColor = 'text-slate-900 dark:text-white/90';
    const buttonClasses = 'bg-white dark:bg-white/10 dark:backdrop-blur-lg text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20 border-slate-300 dark:border-white/20';
    const dropdownClasses = 'bg-white dark:bg-slate-700/80 dark:backdrop-blur-lg text-slate-700 dark:text-slate-200';
    const dropdownItemClasses = 'hover:bg-slate-100 dark:hover:bg-white/20';

    return (
        <header className="bg-white/80 dark:bg-transparent backdrop-blur-lg sticky top-0 z-40">
            <div className={`max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b ${headerBorder}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className={`text-3xl font-bold ${titleColor}`}>
                        {title}
                    </h1>
                    {showActions && (
                        <div className="flex items-center gap-x-2 sm:gap-x-4">
                             <div className="relative" ref={themeDropdownRef}>
                                <button
                                    onClick={() => setIsThemeDropdownOpen(prev => !prev)}
                                    className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-brand-accent/50 border ${buttonClasses}`}
                                    aria-label="Select theme"
                                >
                                    <Palette className="h-5 w-5" />
                                </button>
                                {isThemeDropdownOpen && (
                                     <div className={`origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${dropdownClasses}`}>
                                         <div className="py-1" role="menu" aria-orientation="vertical">
                                            {THEMES.map(themeOption => (
                                                <button
                                                    key={themeOption.id}
                                                    onClick={() => {
                                                        setTheme(themeOption.id);
                                                        setIsThemeDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left flex items-center px-4 py-2 text-sm ${dropdownItemClasses} ${theme === themeOption.id ? 'font-bold text-brand-accent' : ''}`}
                                                    role="menuitem"
                                                >
                                                    {themeOption.name}
                                                </button>
                                            ))}
                                         </div>
                                     </div>
                                )}
                            </div>
                            <div className="relative" ref={exportDropdownRef}>
                                <button
                                    onClick={() => setIsExportDropdownOpen(prev => !prev)}
                                    disabled={isExporting}
                                    className={`inline-flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border ${buttonClasses}`}
                                >
                                    {isExporting ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-5 w-5 mr-2" />
                                            Export PDF
                                        </>
                                    )}
                                </button>
                                {isExportDropdownOpen && (
                                     <div className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${dropdownClasses}`}>
                                         <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                             <button
                                                 onClick={() => handleExportClick('kpis-only')}
                                                 className={`w-full text-left flex items-center px-4 py-2 text-sm ${dropdownItemClasses}`}
                                                 role="menuitem"
                                             >
                                                 Export KPIs Only
                                             </button>
                                             <button
                                                 onClick={() => handleExportClick('with-details')}
                                                 className={`w-full text-left flex items-center px-4 py-2 text-sm ${dropdownItemClasses}`}
                                                 role="menuitem"
                                             >
                                                 Export with All Details
                                             </button>
                                         </div>
                                     </div>
                                )}
                            </div>
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    onClick={handleProfileClick}
                                    className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-brand-accent/50 border ${buttonClasses}`}
                                    aria-haspopup="true"
                                    aria-expanded={isProfileDropdownOpen}
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                {isProfileDropdownOpen && (
                                    <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 ${dropdownClasses}`}>
                                        <button
                                            onClick={handleProfileOption}
                                            className={`w-full text-left flex items-center px-4 py-2 text-sm ${dropdownItemClasses}`}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogoutOption}
                                            className={`w-full text-left flex items-center px-4 py-2 text-sm ${dropdownItemClasses}`}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;