import Header from './Header';

const AD_URL = 'https://youtube.com/channel/UC0l5jIIhkMLqf-d6SDsEfyQ?si=nsrn6JWQ6fqRtdrl';

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>

            {/* 광고 배너 */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <a
                    href={AD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:scale-[1.01] transform"
                >
                    <img
                        src="/images/ad-banner.png"
                        alt="최한솔 선생님의 특수교육임용창고 - YouTube 채널 바로가기"
                        className="w-full h-auto max-h-40 object-contain bg-white"
                    />
                </a>
            </div>

            <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                <p>© 2026 손끝으로 톡 | 특수교육 지문자 학습 앱</p>
            </footer>
        </div>
    );
}

export default Layout;
