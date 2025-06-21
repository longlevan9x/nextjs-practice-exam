export enum TEXT_TYPE {
    PHRASE = 'phrase',
    SENTENCE = 'sentence'
}

/**
 * Phân loại đầu vào: là từ/cụm từ hay câu/đoạn văn
 * @param {string} text - Đầu vào cần kiểm tra
 * @returns {'phrase' | 'sentence'} - Kết quả phân loại
 */
export function determineTextType(text: string): TEXT_TYPE {
    const cleanedText = text.trim();
    const wordCount = cleanedText.split(/\s+/).length;
    const endsWithPunctuation = /[.!?]$/.test(cleanedText);
    const hasSubjectVerbStructure = /\b(I|you|he|she|they|we|it)\b.+\b(am|is|are|was|were|have|has|had|do|does|did|can|will|shall|may|must|should|would|could|might)\b/i.test(cleanedText);

    if (wordCount <= 6 && !endsWithPunctuation && !hasSubjectVerbStructure) {
        return TEXT_TYPE.PHRASE; // từ hoặc cụm từ
    } else {
        return TEXT_TYPE.SENTENCE; // câu hoặc đoạn văn
    }
}