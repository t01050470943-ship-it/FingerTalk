import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { getStats } from '../utils/storage';
import wordsData from '../data/words.json';

function HomePage() {
    const stats = getStats();

    // 오늘의 단어 (매일 다른 단어 표시)
    const today = new Date();
    const dayIndex = today.getDate() % wordsData.words.length;
    const todayWord = wordsData.words[dayIndex];

    return (
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
                    특수교육 현장에서 필수적인<br />
                    <strong>지문자와 지숫자</strong>를 쉽고 재미있게 학습하세요!
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

            {/* Features */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">학습 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="text-center">
                            <span className="text-4xl mb-3 block">📖</span>
                            <h3 className="font-bold text-lg mb-2">플래시카드</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                한글 자음/모음, 숫자, 영어 알파벳을 플래시카드로 학습
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <span className="text-4xl mb-3 block">🎯</span>
                            <h3 className="font-bold text-lg mb-2">객관식 퀴즈</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                4지선다 문제로 지문자 실력 점검
                            </p>
                        </div>
                    </Card>
                    <Card>
                        <div className="text-center">
                            <span className="text-4xl mb-3 block">🏆</span>
                            <h3 className="font-bold text-lg mb-2">단어 조합</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                특수교육 전공 용어를 지문자로 표현
                            </p>
                        </div>
                    </Card>
                </div>
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
    );
}

export default HomePage;
