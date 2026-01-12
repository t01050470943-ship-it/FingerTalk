import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { getSettings, saveSettings, clearAllData, getStats, getWrongAnswers } from '../utils/storage';

function SettingsPage() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(getSettings());
    const [showConfirm, setShowConfirm] = useState(false);
    const stats = getStats();
    const wrongAnswers = getWrongAnswers();

    const handleDarkModeToggle = () => {
        const newSettings = { ...settings, darkMode: !settings.darkMode };
        setSettings(newSettings);
        saveSettings(newSettings);

        if (newSettings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleClearData = () => {
        clearAllData();
        setSettings({ darkMode: false });
        document.documentElement.classList.remove('dark');
        setShowConfirm(false);
        // 홈으로 리다이렉트 (새로고침 대신)
        navigate('/');
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                ⚙️ 설정
            </h1>

            {/* 다크 모드 */}
            <Card className="mb-6" hover={false}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                            다크 모드
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            어두운 테마로 눈의 피로를 줄이세요
                        </p>
                    </div>
                    <button
                        onClick={handleDarkModeToggle}
                        className={`relative w-14 h-8 rounded-full transition-colors ${settings.darkMode ? 'bg-primary-500' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow ${settings.darkMode ? 'left-7' : 'left-1'
                                }`}
                        />
                    </button>
                </div>
            </Card>

            {/* 학습 현황 */}
            <Card className="mb-6" hover={false}>
                <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
                    📊 학습 현황
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-primary-600">{stats.totalQuizzes}</p>
                        <p className="text-sm text-gray-500">완료한 퀴즈</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-accent-600">{stats.averageScore}%</p>
                        <p className="text-sm text-gray-500">평균 점수</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-orange-500">{stats.wrongAnswersCount}</p>
                        <p className="text-sm text-gray-500">저장된 오답</p>
                    </div>
                </div>
            </Card>

            {/* 오답 노트 */}
            {wrongAnswers.length > 0 && (
                <Card className="mb-6" hover={false}>
                    <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
                        📝 최근 오답 노트
                    </h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {wrongAnswers.slice(-10).reverse().map((wrong, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <span className="text-green-600 font-bold">{wrong.correctAnswer}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-red-500">{wrong.userAnswer}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* 데이터 초기화 */}
            <Card className="border-2 border-red-200 dark:border-red-900" hover={false}>
                <h2 className="font-bold text-lg mb-2 text-red-600">
                    ⚠️ 데이터 초기화
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    모든 학습 진도, 퀴즈 결과, 오답 노트가 삭제됩니다.
                </p>

                {!showConfirm ? (
                    <Button onClick={() => setShowConfirm(true)} variant="danger">
                        데이터 초기화
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button onClick={handleClearData} variant="danger">
                            정말 삭제
                        </Button>
                        <Button onClick={() => setShowConfirm(false)} variant="secondary">
                            취소
                        </Button>
                    </div>
                )}
            </Card>

            {/* 앱 정보 */}
            <div className="mt-8 text-center text-sm text-gray-400">
                <p>손끝으로 톡 (FingerTalk) v1.0.0</p>
                <p>특수교육 지문자 학습 앱</p>
                <p className="mt-2">© 2026 Choi Han-sol</p>
            </div>
        </div>
    );
}

export default SettingsPage;
