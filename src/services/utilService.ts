/* eslint-disable @typescript-eslint/no-explicit-any */
export function shuffleArray(array: any[]) {
    const result = array.slice(); // tạo bản sao mảng để không thay đổi mảng gốc
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // chọn ngẫu nhiên chỉ số từ 0 đến i
        [result[i], result[j]] = [result[j], result[i]]; // hoán đổi
    }
    return result;
}
