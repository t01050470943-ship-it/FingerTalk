import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { saveQuizResult } from '../utils/storage';
import categoriesData from '../data/categories.json';

const TIME_LIMIT = 60; // 60초

// 모든 카테고리 아이템 합치기
function getAllItems() {
    const items = [];

    // 한글 자음
    categoriesData.hangulConsonants.items.forEach((item) => {
        items.push({
            value: item,
            category: 'hangulConsonants',
            imagePath: `/images/hangul/${item}.png`,
        });
    });

    // 한글 모음
    categoriesData.hangulVowels.items.forEach((item) => {
        items.push({
            value: item,
            category: 'hangulVowels',
            imagePath: `/images/hangul/${item}.png`,
        });
    });

    // 숫자
    categoriesData.numbers.items.forEach((item) => {
        const ext = categoriesData.numbers.extensions[String(item)];
        items.push({
            value: String(item),
            category: 'numbers',
            imagePath: `/images/numbers/${item}${ext}`,
        });
    });

    // 영어
    categoriesData.english.items.forEach((item) => {
        const ext = categoriesData.english.extensions[item];
        items.push({
            value: item,
            category: 'english',
            imagePath: `/images/english/${item}${ext}`,
        });
    });

    return items;
}

// 배열 섞기
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function TimeAttackPage() {
    const navigate = useNavigate();
    const allItems = useRef(getAllItems());

    const [step, setStep] = useState('ready'); // ready, playing, result
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [streak, setStreak] = useState(0);

    const generateQuestion = useCallback(() => {
        const shuffled = shuffleArray(allItems.current);
        const correct = shuffled[0];

        // 같은 카테고리에서 오답 3개 선택 (없으면 다른 카테고리에서)
        const sameCategory = shuffled.filter((item) => item.category === correct.category && item.value !== correct.value);
        let wrongOptions;

        if (sameCategory.length >= 3) {
            wrongOptions = sameCategory.slice(0, 3);
        } else {
            const others = shuffled.filter((item) => item.value !== correct.value).slice(0, 3);
            wrongOptions = others;
        }

        const allOptions = shuffleArray([correct, ...wrongOptions]);

        setCurrentQuestion(correct);
        setOptions(allOptions);
    }, []);

    const startGame = () => {
        setStep('playing');
        setTimeLeft(TIME_LIMIT);
        setScore(0);
        setStreak(0);
        generateQuestion();
    };

    // 타이머
    useEffect(() => {
        if (step !== 'playing') return;

        if (timeLeft <= 0) {
            saveQuizResult({
                quizType: 'timeattack',
                category: 'all',
                score,
                total: score, // 타임어택은 맞춘 개수가 total
            });
            setStep('result');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [step, timeLeft, score]);

    const handleAnswer = (answer) => {
        if (showFeedback) return;

        const correct = answer.value === currentQuestion.value;
        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore((prev) => prev + 1);
            setStreak((prev) => prev + 1);
        } else {
            setStreak(0);
        }

        // 0.5초 후 다음 문제
        setTimeout(() => {
            setShowFeedback(false);
            generateQuestion();
        }, 500);
    };

    // 준비 화면
    if (step === 'ready') {
        return (
            <div className="animate-fade-in text-center">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/quiz')}
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2 mx-auto"
                    >
                        ← 퀴즈 메뉴
                    </button>
                </div>

                <span className="text-8xl mb-6 block">⏱️</span>
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    타임 어택
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    <strong>{TIME_LIMIT}초</strong> 안에 최대한 많은 문제를 맞추세요!
                </p>

                <Card className="max-w-sm mx-auto mb-8" hover={false}>
                    <div className="space-y-2 text-left">
                        <p>• 지문자 이미지를 보고 4지선다 중 정답 선택</p>
                        <p>• 한글(자음/모음), 숫자, 영어 모두 출제</p>
                        <p>• 연속 정답 시 콤보 표시!</p>
                    </div>
                </Card>

                <Button onClick={startGame} variant="accent" size="xl">
                    🚀 시작하기
                </Button>
            </div>
        );
    }

    // 게임 화면
    if (step === 'playing') {
        const urgency = timeLeft <= 10;

        return (
            <div className="animate-fade-in">
                {/* Timer & Score */}
                <div className="flex justify-between items-center mb-4">
                    <div className={`text-3xl font-bold ${urgency ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-200'}`}>
                        ⏱️ {timeLeft}초
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                            점수: {score}
                        </div>
                        {streak >= 3 && (
                            <div className="text-sm text-accent-500 font-bold animate-bounce">
                                🔥 {streak} 연속!
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar (time) */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${urgency ? 'bg-red-500' : 'bg-gradient-to-r from-primary-500 to-accent-500'
                            }`}
                        style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
                    />
                </div>

                {/* Question Image */}
                <Card className={`mb-6 ${showFeedback ? (isCorrect ? 'answer-correct' : 'answer-incorrect') : ''}`} hover={false}>
                    <div className="img-container mx-auto" style={{ maxWidth: '200px', height: '200px' }}>
                        <img
                            src={currentQuestion.imagePath}
                            alt="지문자 이미지"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </Card>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={showFeedback}
                            className={`card text-center text-3xl font-bold py-6 transition-all ${showFeedback && option.value === currentQuestion.value
                                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500'
                                    : ''
                                }`}
                        >
                            {option.value}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // 결과 화면
    if (step === 'result') {
        return (
            <div className="animate-fade-in text-center">
                <span className="text-8xl mb-6 block">
                    {score >= 20 ? '🏆' : score >= 10 ? '🎉' : '👍'}
                </span>
                <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    타임 오버!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                    {TIME_LIMIT}초 동안
                </p>
                <p className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {score}개 정답!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={startGame} variant="accent" size="lg">
                        다시 도전
                    </Button>
                    <Button onClick={() => navigate('/quiz')} variant="outline" size="lg">
                        퀴즈 메뉴로
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}

export default TimeAttackPage;
