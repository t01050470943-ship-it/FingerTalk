import { CategorySelector } from '../components/Study';

function StudyPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                    📚 학습하기
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    학습할 카테고리를 선택하세요. 플래시카드를 클릭하면 지문자 이미지를 볼 수 있습니다.
                </p>
            </div>

            <CategorySelector basePath="/study" />
        </div>
    );
}

export default StudyPage;
