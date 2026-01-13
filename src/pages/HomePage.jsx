import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Modal } from '../components/ui';
import { getStats, hasConsent, saveConsent } from '../utils/storage';
import wordsData from '../data/words.json';

function HomePage() {
    const stats = getStats();
    const [showCopyrightModal, setShowCopyrightModal] = useState(false);
    const [agreedToCopyright, setAgreedToCopyright] = useState(false);

    // 저작권 동의 확인
    useEffect(() => {
        const checkConsent = () => {
            if (!hasConsent()) {
                setShowCopyrightModal(true);
            }
        };
        checkConsent();
    }, []);

    const handleCopyrightAgree = () => {
        if (agreedToCopyright) {
            saveConsent();
            setShowCopyrightModal(false);
        }
    };

    // 오늘의 단어 (매일 다른 단어 표시)
    const today = new Date();
    const dayIndex = today.getDate() % wordsData.words.length;
    const todayWord = wordsData.words[dayIndex];

    return (
        <>
            {/* 저작권 안내 모달 */}
            <Modal isOpen={showCopyrightModal} showCloseButton={false}>
                <div className="text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                        저작권 안내
                    </h2>
                </div>

                <div className="space-y-4 text-left mb-6 text-gray-700 dark:text-gray-300">
                    <p className="font-semibold text-primary-600 dark:text-primary-400">
                        이 앱은 특수교육 임용공부를 하는 최한솔 선생님께서 수험생들을 위해 만든 앱입니다.
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                        <p>• <strong>비영리 목적</strong>의 개인적 사용은 언제나 환영합니다.</p>
                        <p>• 단, 개발자의 <strong className="text-red-600 dark:text-red-400">사전 동의 없는</strong> 상업적 이용, 무단 복제, 수정(2차 가공), 재배포를 엄격히 금지합니다.</p>
                        <p>• 이를 위반할 경우 <strong className="text-red-600 dark:text-red-400">저작권법</strong>에 의거하여 법적 책임을 물을 수 있습니다.</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <input
                            type="checkbox"
                            checked={agreedToCopyright}
                            onChange={(e) => setAgreedToCopyright(e.target.checked)}
                            className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            위 내용을 확인했으며 이에 동의합니다.
                        </span>
                    </label>
                </div>

                <Button
                    onClick={handleCopyrightAgree}
                    variant="primary"
                    size="lg"
                    disabled={!agreedToCopyright}
                    className="w-full"
                >
                    확인
                </Button>
            </Modal>

            <div className="space-y-8 animate-fade-in">
                {/* Hero Section */}
                <section className="text-center py-8">
                    <div className="inline-block mb-4">
                        <span className="text-6xl animate-bounce-in">🤟</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            손끝으로 톡
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        특수교육 임용고시 준비생을 위한<br />
                        <strong>지문자 학습 앱</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/study">
                            <Button size="lg" variant="primary">
                                📚 학습 시작하기
                            </Button>
                        </Link>
                        <Link to="/quiz">
                            <Button size="lg" variant="outline">
                                ✍️ 퀴즈 도전하기
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Today's Word */}
                <section>
                    <Card className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 border-2 border-primary-200 dark:border-primary-700" hover={false}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl">
                                💡
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">오늘의 특수교육 단어</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {todayWord.word}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    카테고리: {todayWord.category}
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Stats */}
                {stats.totalQuizzes > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">나의 학습 현황</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="text-center" hover={false}>
                                <p className="text-3xl font-bold text-primary-600">{stats.totalQuizzes}</p>
                                <p className="text-sm text-gray-500">완료한 퀴즈</p>
                            </Card>
                            <Card className="text-center" hover={false}>
                                <p className="text-3xl font-bold text-accent-600">{stats.averageScore}%</p>
                                <p className="text-sm text-gray-500">평균 점수</p>
                            </Card>
                            <Card className="text-center" hover={false}>
                                <p className="text-3xl font-bold text-orange-500">{stats.wrongAnswersCount}</p>
                                <p className="text-sm text-gray-500">오답 노트</p>
                            </Card>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

export default HomePage;
