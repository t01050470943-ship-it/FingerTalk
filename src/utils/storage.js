const STORAGE_KEYS = {
    PROGRESS: 'fingertalk_progress',
    QUIZ_RESULTS: 'fingertalk_quiz_results',
    SETTINGS: 'fingertalk_settings',
    WRONG_ANSWERS: 'fingertalk_wrong_answers',
};

/**
 * 학습 진도 저장
 * @param {string} category - 카테고리 ID
 * @param {number} index - 마지막 학습 인덱스
 */
export function saveProgress(category, index) {
    const progress = getProgress();
    progress[category] = {
        lastIndex: index,
        lastStudied: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

/**
 * 학습 진도 불러오기
 * @returns {Object} 카테고리별 진도 정보
 */
export function getProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {};
}

/**
 * 퀴즈 결과 저장
 * @param {Object} result - { quizType, category, score, total, date }
 */
export function saveQuizResult(result) {
    const results = getQuizResults();
    results.push({
        ...result,
        date: new Date().toISOString(),
    });
    // 최근 50개만 유지
    if (results.length > 50) {
        results.splice(0, results.length - 50);
    }
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
}

/**
 * 퀴즈 결과 불러오기
 * @returns {Array} 퀴즈 결과 배열
 */
export function getQuizResults() {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return data ? JSON.parse(data) : [];
}

/**
 * 오답 저장
 * @param {Object} wrongAnswer - { question, userAnswer, correctAnswer, category }
 */
export function saveWrongAnswer(wrongAnswer) {
    const wrongAnswers = getWrongAnswers();
    wrongAnswers.push({
        ...wrongAnswer,
        date: new Date().toISOString(),
    });
    // 최근 100개만 유지
    if (wrongAnswers.length > 100) {
        wrongAnswers.splice(0, wrongAnswers.length - 100);
    }
    localStorage.setItem(STORAGE_KEYS.WRONG_ANSWERS, JSON.stringify(wrongAnswers));
}

/**
 * 오답 불러오기
 * @returns {Array} 오답 배열
 */
export function getWrongAnswers() {
    const data = localStorage.getItem(STORAGE_KEYS.WRONG_ANSWERS);
    return data ? JSON.parse(data) : [];
}

/**
 * 설정 저장
 * @param {Object} settings - { darkMode, ... }
 */
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * 설정 불러오기
 * @returns {Object} 설정 객체
 */
export function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { darkMode: false };
}

/**
 * 모든 데이터 초기화
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
    });
}

/**
 * 통계 정보 가져오기
 * @returns {Object} { totalQuizzes, averageScore, wrongAnswersCount }
 */
export function getStats() {
    const results = getQuizResults();
    const wrongAnswers = getWrongAnswers();

    const totalQuizzes = results.length;
    const averageScore = totalQuizzes > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / totalQuizzes)
        : 0;

    return {
        totalQuizzes,
        averageScore,
        wrongAnswersCount: wrongAnswers.length,
    };
}
