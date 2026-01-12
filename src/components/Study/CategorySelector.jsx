import { Link } from 'react-router-dom';
import { Card } from '../ui';

const categories = [
    {
        id: 'hangulConsonants',
        name: '한글 자음',
        icon: 'ㄱㄴㄷ',
        description: '14개의 한글 자음 지문자',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'hangulVowels',
        name: '한글 모음',
        icon: 'ㅏㅓㅗ',
        description: '17개의 한글 모음 지문자',
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 'numbers',
        name: '지숫자',
        icon: '123',
        description: '1부터 20까지의 지숫자',
        color: 'from-orange-500 to-amber-500',
    },
    {
        id: 'english',
        name: '영어 알파벳',
        icon: 'ABC',
        description: '26개의 영어 알파벳 지문자',
        color: 'from-purple-500 to-pink-500',
    },
];

function CategorySelector({ basePath = '/study' }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category) => (
                <Link key={category.id} to={`${basePath}/${category.id}`}>
                    <Card className="category-card h-full">
                        <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                                {category.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export default CategorySelector;
export { categories };
