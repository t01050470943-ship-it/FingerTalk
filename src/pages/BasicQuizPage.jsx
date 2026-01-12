import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { CategorySelector, categories } from '../components/Study';
import { saveQuizResult, saveWrongAnswer } from '../utils/storage';
import categoriesData from '../data/categories.json';

// 배열 섞기 함수
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function BasicQuizPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState('category'); // category, playing, result
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const generateQuestions = useCallback((categoryId) => {
        const categoryData = categoriesData[categoryId];
        const items = categoryData.items;
        const shuffledItems = shuffleArray(items);
        const questionCount = Math.min(10, items.length);

        return shuffledItems.slice(0, questionCount).map((correctAnswer) => {
            // 오답 보기 생성 (정답 제외 랜덤 3개)
            const otherItems = items.filter((item) => item !== correctAnswer);
            const wrongOptions = shuffleArray(otherItems).slice(0, 3);
            const options = shuffleArray([correctAnswer, ...wrongOptions]);

            return {
                correctAnswer,
                options,
                imagePath: getImagePath(categoryId, correctAnswer),
            };
        });
    }, []);

    const getImagePath = (categoryId, item) => {
        const categoryData = categoriesData[categoryId];
        const basePath = categoryData.basePath;
        if (categoryData.extension) {
            return `${basePath}${item}${categoryData.extension}`;
        } else if (categoryData.extensions) {
            return `${basePath}${item}${categoryData.extensions[String(item)]}`;
        }
        return `${basePath}${item}.png`;
    };

    const startQuiz = (categoryId) => {
        setSelectedCategory(categoryId);
        setQuestions(generateQuestions(categoryId));
        setCurrentIndex(0);
        setScore(0);
        setWrongAnswers([]);
        setStep('playing');
    };

    const handleAnswer = (answer) => {
        if (showFeedback) return;

        setSelectedAnswer(answer);
        setShowFeedback(true);

        const currentQuestion = questions[currentIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        if (isCorrect) {
            setScore((prev) => prev + 1);
        } else {
            const wrong = {
                question: currentQuestion.correctAnswer,
                userAnswer: answer,
                correctAnswer: currentQuestion.correctAnswer,
                category: selectedCategory,
            };
            setWrongAnswers((prev) => [...prev, wrong]);
            saveWrongAnswer(wrong);
        }

        // 1초 후 다음 문제로
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedAnswer(null);

            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                // 퀴즈 종료
                saveQuizResult({
                    quizType: 'basic',
                    category: selectedCategory,
                    score: score + (isCorrect ? 1 : 0),
                    total: questions.length,
                });
                setStep('result');
            }
        }, 1000);
    };

    // 카테고리 선택 화면
    if (step === 'category') {
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
                        🎯 기초 퀴즈
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        학습할 카테고리를 선택하세요. 지문자 이미지를 보고 정답을 맞춥니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            onClick={() => startQuiz(category.id)}
                            className="category-card"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
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

                {/* Question Image */}
                <Card className="mb-6" hover={false}>
                    <p className="text-center text-gray-500 mb-4">이 지문자는 무엇일까요?</p>
                    <div className="img-container mx-auto" style={{ maxWidth: '250px', maxHeight: '250px' }}>
                        <img
                            src={currentQuestion.imagePath}
                            alt="지문자 이미지"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </Card>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        let optionClass = 'card text-center text-2xl font-bold py-6';

                        if (showFeedback) {
                            if (option === currentQuestion.correctAnswer) {
                                optionClass += ' answer-correct';
                            } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                                optionClass += ' answer-incorrect';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={showFeedback}
                                className={optionClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
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
                    <div className="mb-8 text-left">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                            📝 오답 노트
                        </h2>
                        <div className="space-y-3">
                            {wrongAnswers.map((wrong, index) => (
                                <Card key={index} className="flex items-center gap-4" hover={false}>
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={getImagePath(wrong.category, wrong.correctAnswer)}
                                            alt={`${wrong.correctAnswer} 지문자`}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">정답</p>
                                        <p className="text-xl font-bold text-green-600">{wrong.correctAnswer}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <p className="text-sm text-gray-500">내 답변</p>
                                        <p className="text-xl font-bold text-red-500">{wrong.userAnswer}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => startQuiz(selectedCategory)} variant="primary" size="lg">
                        다시 풀기
                    </Button>
                    <Button onClick={() => setStep('category')} variant="secondary" size="lg">
                        다른 카테고리
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

export default BasicQuizPage;
