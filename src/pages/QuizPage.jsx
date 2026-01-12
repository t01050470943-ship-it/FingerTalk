import { Link } from 'react-router-dom';
import { Card } from '../components/ui';

const quizTypes = [
    {
        id: 'basic',
        name: '기초 퀴즈',
        icon: '🎯',
        description: '지문자 이미지를 보고 정답을 맞추는 객관식 퀴즈',
        color: 'from-blue-500 to-cyan-500',
        path: '/quiz/basic',
    },
    {
        id: 'advanced',
        name: '심화 퀴즈 (단어 조합)',
        icon: '🏆',
        description: '특수교육 전공 용어를 지문자로 읽고 답을 입력',
        color: 'from-purple-500 to-pink-500',
        path: '/quiz/advanced',
    },
    {
        id: 'timeattack',
        name: '타임 어택',
        icon: '⏱️',
        description: '60초 안에 최대한 많은 문제를 맞추세요!',
        color: 'from-orange-500 to-red-500',
        path: '/quiz/timeattack',
    },
];

function QuizPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    ✍️ 퀴즈
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    학습한 내용을 퀴즈로 점검해 보세요!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizTypes.map((quiz) => (
                    <Link key={quiz.id} to={quiz.path}>
                        <Card className="h-full">
                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${quiz.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                                    {quiz.icon}
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-100">
                                    {quiz.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {quiz.description}
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default QuizPage;
