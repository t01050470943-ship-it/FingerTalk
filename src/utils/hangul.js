import Hangul from 'hangul-js';

// 쌍자음 매핑: 이미지가 없으므로 자음 2번 나열
const DOUBLE_CONSONANTS = {
    'ㄲ': ['ㄱ', 'ㄱ'],
    'ㄸ': ['ㄷ', 'ㄷ'],
    'ㅃ': ['ㅂ', 'ㅂ'],
    'ㅆ': ['ㅅ', 'ㅅ'],
    'ㅉ': ['ㅈ', 'ㅈ'],
};

// 복합모음 매핑: 이미지가 없으므로 구성 모음 나열
const COMPLEX_VOWELS = {
    'ㅘ': ['ㅗ', 'ㅏ'],
    'ㅙ': ['ㅗ', 'ㅐ'],
    'ㅚ': ['ㅗ', 'ㅣ'],
    'ㅝ': ['ㅜ', 'ㅓ'],
    'ㅞ': ['ㅜ', 'ㅔ'],
    'ㅟ': ['ㅜ', 'ㅣ'],
    'ㅢ': ['ㅡ', 'ㅣ'],
};

/**
 * 한글 문자열을 자모(Jamo)로 분해하고 이미지 경로 반환
 * @param {string} text - 분해할 한글 문자열
 * @returns {Array<{jamo: string, src: string}>} - Jamo와 이미지 경로 배열
 */
export function decomposeToJamo(text) {
    const result = [];

    // hangul-js로 기본 분해
    const disassembled = Hangul.disassemble(text);

    disassembled.forEach((char) => {
        // 쌍자음 처리
        if (DOUBLE_CONSONANTS[char]) {
            DOUBLE_CONSONANTS[char].forEach((c) => {
                result.push({
                    jamo: c,
                    src: `/images/hangul/${c}.png`,
                });
            });
        }
        // 복합모음 처리
        else if (COMPLEX_VOWELS[char]) {
            COMPLEX_VOWELS[char].forEach((v) => {
                result.push({
                    jamo: v,
                    src: `/images/hangul/${v}.png`,
                });
            });
        }
        // 일반 자모
        else {
            result.push({
                jamo: char,
                src: `/images/hangul/${char}.png`,
            });
        }
    });

    return result;
}

/**
 * 영어 문자열을 알파벳으로 분해하고 이미지 경로 반환
 * @param {string} text - 분해할 영어 문자열
 * @returns {Array<{char: string, src: string}>}
 */
export function decomposeEnglish(text) {
    const extensions = {
        'j': '.png', 'm': '.png', 'n': '.png'
    };

    return text.toLowerCase().split('').map((char) => {
        const ext = extensions[char] || '.jpg';
        return {
            char,
            src: `/images/english/${char}${ext}`,
        };
    });
}

/**
 * 텍스트가 한글인지 영어인지 판별
 * @param {string} text 
 * @returns {'hangul' | 'english' | 'mixed'}
 */
export function detectLanguage(text) {
    const hasHangul = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasHangul && !hasEnglish) return 'hangul';
    if (hasEnglish && !hasHangul) return 'english';
    return 'mixed';
}
