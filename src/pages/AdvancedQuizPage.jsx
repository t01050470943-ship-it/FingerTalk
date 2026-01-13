import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { decomposeToJamo, decomposeEnglish, detectLanguage } from '../utils/hangul';
import { saveQuizResult, saveWrongAnswer } from '../utils/storage';
import wordsData from '../data/words.json';

// 배열 섞기 함수
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function AdvancedQuizPage() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [step, setStep] = useState('setup'); // setup, playing, result
    const [questionCount, setQuestionCount] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const startQuiz = () => {
        const shuffledWords = shuffleArray(wordsData.words);
        const selectedWords = shuffledWords.slice(0, questionCount);

        const generatedQuestions = selectedWords.map((wordObj) => {
            const word = wordObj.word;
            const language = detectLanguage(word);

            let jamoImages;
            if (language === 'hangul') {
                jamoImages = decomposeToJamo(word);
            } else if (language === 'english') {
                jamoImages = decomposeEnglish(word);
            } else {
                // mixed - 한글 우선
                jamoImages = decomposeToJamo(word);
            }

            return {
                word,
                category: wordObj.category,
                jamoImages,
            };
        });

        setQuestions(generatedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setWrongAnswers([]);
        setUserAnswer('');
        setStep('playing');
    };

    useEffect(() => {
        if (step === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [step, currentIndex]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (showFeedback || !userAnswer.trim()) return;

        const currentQuestion = questions[currentIndex];
        const normalizedAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrect = currentQuestion.word.toLowerCase();
        const correct = normalizedAnswer === normalizedCorrect;

        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore((prev) => prev + 1);
        } else {
            const wrong = {
                question: currentQuestion.word,
                userAnswer: userAnswer.trim(),
                correctAnswer: currentQuestion.word,
                category: 'advanced',
            };
            setWrongAnswers((prev) => [...prev, wrong]);
            saveWrongAnswer(wrong);
        }

        // 1.5초 후 다음 문제로
        setTimeout(() => {
            setShowFeedback(false);
            setUserAnswer('');

            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                // 퀴즈 종료
                saveQuizResult({
                    quizType: 'advanced',
                    category: 'words',
                    score: score + (correct ? 1 : 0),
                    total: questions.length,
                });
                setStep('result');
            }
        }, 1500);
    };

    // 설정 화면
    if (step === 'setup') {
        return (
            <div className="animate-fade-in">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/quiz')}
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
                    >
                        ← 퀴즈 메뉴
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        🏆 심화 퀴즈 (단어 조합)
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        지문자 이미지를 보고 특수교육 전공 용어를 입력하세요.
                    </p>
                </div>

                <Card className="max-w-md mx-auto" hover={false}>
                    <h2 className="font-bold text-lg mb-4">문제 수 선택</h2>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {[3, 5, 7, 10].map((count) => (
                            <button
                                key={count}
                                onClick={() => setQuestionCount(count)}
                                className={`py-3 rounded-lg font-bold transition-all ${questionCount === count
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {count}문제
                            </button>
                        ))}
                    </div>
                    <Button onClick={startQuiz} variant="primary" size="lg" className="w-full">
                        시작하기
                    </Button>
                </Card>
            </div>
        );
    }

    // 퀴즈 진행 화면
    if (step === 'playing') {
        const currentQuestion = questions[currentIndex];

        return (
            <div className="animate-fade-in">
                {/* Progress */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                        문제 {currentIndex + 1} / {questions.length}
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                        점수: {score}
                    </span>
                </div>

                <div className="progress-bar mb-6">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                {/* Question - Jamo Images */}
                <Card className="mb-6" hover={false}>
                    <p className="text-center text-gray-500 mb-2">이 지문자는 어떤 단어일까요?</p>
                    <p className="text-center text-xs text-gray-400 mb-4">진행 방향 →</p>

                    <div className="flex gap-1 overflow-x-auto py-4 min-h-[140px] items-center justify-center">
                        {currentQuestion.jamoImages.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center"
                            >
                                <img
                                    src={item.src}
                                    alt={item.jamo || item.char}
                                    className="max-w-full max-h-full object-contain p-1"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-gray-400">${item.jamo || item.char}</span>`;
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-2">
                        카테고리: {currentQuestion.category}
                    </p>
                </Card>

                {/* Answer Input */}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showFeedback}
                            placeholder="정답을 입력하세요"
                            className={`w-full px-4 py-3 text-xl text-center rounded-xl border-2 focus:outline-none transition-all ${showFeedback
                                ? isCorrect
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                    : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                : 'border-gray-200 dark:border-gray-600 focus:border-primary-500 bg-white dark:bg-gray-800'
                                }`}
                        />
                        {showFeedback && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                                {isCorrect ? '✅' : '❌'}
                            </span>
                        )}
                    </div>

                    {showFeedback && !isCorrect && (
                        <p className="text-center mt-2 text-green-600 font-bold">
                            정답: {currentQuestion.word}
                        </p>
                    )}

                    {!showFeedback && (
                        <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
                            확인
                        </Button>
                    )}
                </form>
            </div>
        );
    }

    // 결과 화면
    if (step === 'result') {
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="animate-fade-in text-center">
                <div className="mb-8">
                    <span className="text-6xl mb-4 block">
                        {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                    </span>
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                        퀴즈 완료!
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        {questions.length}문제 중 <strong className="text-primary-600">{score}개</strong> 정답
                    </p>
                    <p className="text-4xl font-bold mt-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        {percentage}%
                    </p>
                </div>

                {/* 오답 노트 */}
                {wrongAnswers.length > 0 && (
                    <div className="mb-8 text-left max-w-lg mx-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                            📝 오답 노트
                        </h2>
                        <div className="space-y-3">
                            {wrongAnswers.map((wrong, index) => (
                                <Card key={index} hover={false}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">정답</p>
                                            <p className="text-xl font-bold text-green-600">{wrong.correctAnswer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">내 답변</p>
                                            <p className="text-xl font-bold text-red-500">{wrong.userAnswer}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={startQuiz} variant="primary" size="lg">
                        다시 풀기
                    </Button>
                    <Button onClick={() => setStep('setup')} variant="secondary" size="lg">
                        문제 수 변경
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

export default AdvancedQuizPage;
