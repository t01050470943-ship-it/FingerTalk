import { useState } from 'react';

function FlashCard({ front, back, backType = 'image', alt = '' }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`flashcard w-full max-w-sm h-80 ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            onKeyDown={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
            tabIndex={0}
            role="button"
            aria-label={isFlipped ? '앞면 보기' : '뒷면 보기'}
        >
            <div className="flashcard-inner">
                {/* Front - Text */}
                <div className="flashcard-front bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-100 dark:border-gray-700">
                    <div className="text-center p-6">
                        <p className="text-gray-400 text-sm mb-2">클릭해서 뒤집기</p>
                        <span className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                            {front}
                        </span>
                    </div>
                </div>

                {/* Back - Image or Text */}
                <div className="flashcard-back bg-white dark:bg-gray-800 shadow-lg border-2 border-gray-100 dark:border-gray-700">
                    {backType === 'image' ? (
                        <div className="img-container w-full h-full">
                            <img
                                src={back}
                                alt={alt || `${front} 지문자`}
                                className="max-w-[80%] max-h-[80%] object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.innerHTML = `<span class="text-4xl font-bold text-gray-400">${front}</span>`;
                                }}
                            />
                        </div>
                    ) : (
                        <span className="text-4xl font-bold text-gray-700 dark:text-gray-200">
                            {back}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FlashCard;
