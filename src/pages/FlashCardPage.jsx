import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlashCard, categories } from '../components/Study';
import { Button } from '../components/ui';
import categoriesData from '../data/categories.json';

function FlashCardPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const categoryInfo = categories.find((c) => c.id === category);
    const categoryData = categoriesData[category];

    if (!categoryInfo || !categoryData) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">카테고리를 찾을 수 없습니다.</p>
                <Button onClick={() => navigate('/study')} className="mt-4">
                    돌아가기
                </Button>
            </div>
        );
    }

    const items = categoryData.items;
    const currentItem = items[currentIndex];

    // 이미지 경로 생성
    const getImagePath = (item) => {
        const basePath = categoryData.basePath;
        if (categoryData.extension) {
            return `${basePath}${item}${categoryData.extension}`;
        } else if (categoryData.extensions) {
            return `${basePath}${item}${categoryData.extensions[String(item)]}`;
        }
        return `${basePath}${item}.png`;
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <button
                        onClick={() => navigate('/study')}
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
                    >
                        ← 카테고리 선택
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {categoryInfo.name}
                    </h1>
                </div>
                <div className="text-right">
                    <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {items.length}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mb-8">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                />
            </div>

            {/* Flashcard */}
            <div className="flex justify-center mb-8">
                <FlashCard
                    front={String(currentItem)}
                    back={getImagePath(currentItem)}
                    alt={`${currentItem} 지문자`}
                />
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
                <Button onClick={handlePrev} variant="secondary" size="lg">
                    ◀ 이전
                </Button>
                <Button onClick={handleNext} variant="primary" size="lg">
                    다음 ▶
                </Button>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-sm text-gray-400 mt-6">
                💡 카드를 클릭하면 뒤집힙니다
            </p>
        </div>
    );
}

export default FlashCardPage;
