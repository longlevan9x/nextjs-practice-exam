import { awsAliasMap } from "@/aliasMapData/awsAliasMap";


/**
 * @param term - Từ khóa cần kiểm tra
 * @description Kiểm tra xem từ khóa có phải là tên viết tắt hoặc tên đầy đủ của một dịch vụ AWS hay không.
 * @returns true nếu từ khóa là tên dịch vụ AWS, ngược lại false
 */
export function isAwsService(term: string): boolean {
    const normalized = term.trim().toLowerCase();

    return Object.values(awsAliasMap).some(aliasList =>
        aliasList.some(alias => alias.toLowerCase() === normalized)
    );
}

/**
 * @param term - Từ khóa cần kiểm tra
 * @description Lấy tên viết tắt của dịch vụ AWS từ từ khóa.
 * @returns Tên viết tắt của dịch vụ AWS nếu tìm thấy, ngược lại trả về null
 */
export function getAwsServiceKey(term: string): string | null {
    const normalized = term.trim().toLowerCase();

    for (const [key, aliasList] of Object.entries(awsAliasMap)) {
        if (aliasList.some(alias => alias.toLowerCase() === normalized)) {
            return key; // Trả về key viết tắt, ví dụ "ALB"
        }
    }

    return null; // Không tìm thấy
}
