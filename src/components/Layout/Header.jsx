import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/study', label: '학습', icon: '📚' },
    { path: '/quiz', label: '퀴즈', icon: '✍️' },
    { path: '/settings', label: '설정', icon: '⚙️' },
];

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="glass sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🤟</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            손끝으로 톡
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        <DarkModeToggle />
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <DarkModeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="메뉴 열기"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg ${location.pathname === item.path
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}

export default Header;
