import { AI_PROMPT_TYPE } from "@/constants/ai";
import { stripHtml } from "@/utils/util";

export function buildDefaultPrompt(toolType: string, content: string): string {
    let prompt = "";

    if (toolType === AI_PROMPT_TYPE.TRAN) {
        prompt += "Tôi muốn bạn đóng vai trò là chuyên gia ngôn ngữ Anh - Việt. Hãy giúp tôi dịch đoạn tiếng Anh sau.\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Dịch sang tiếng Việt tự nhiên, sát nghĩa, nhưng vẫn giữ đúng sắc thái gốc.\n";
        prompt += "2. Giữ nguyên các từ khóa tiếng Anh nếu mang nghĩa chuyên ngành.\n";
        prompt += "Văn bản cần dịch:\n";
    }
    else if (toolType === AI_PROMPT_TYPE.EXPLAIN) {
        prompt += "Hãy phân tích kỹ câu hỏi trắc nghiệm sau đây. Chủ đề liên quan đến AWS.\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Giải thích câu hỏi một cách chi tiết, rõ ràng (nếu có câu hỏi và đáp án, không có thì bỏ qua).\n";
        prompt += "2. Đưa ra đáp án đúng trước, chỉ rõ lý do chọn. (nếu có câu hỏi và đáp án, không có thì bỏ qua)\n";
        prompt += "3. Giải thích tất cả các phương án (đúng và sai), nêu rõ vì sao đúng, vì sao sai, nếu có ví dụ minh họa thì càng tốt. (nếu có câu hỏi và đáp án, không có thì bỏ qua)\n";
        prompt += "4. Sử dụng kiến thức cập nhật mới nhất đến năm 2025 (vui lòng áp dụng theo phiên bản mới nhất).\n";
        prompt += "5. Trình bày hoàn toàn bằng tiếng Việt, rõ ràng, dễ hiểu.\n";
        prompt += "6. Các câu hỏi không cần dịch chỉ cần giải thích.\n";
        prompt += "7. Đưa ra các ví dụ minh họa cụ thể nếu có thể.\n";
        prompt += "Văn bản cần giải thích:\n";
    }
    else if (toolType === AI_PROMPT_TYPE.TRAN_BASIC) {
        prompt += "Tôi muốn bạn đóng vai trò là chuyên gia ngôn ngữ Anh - Việt. Hãy giúp tôi dịch đoạn tiếng Anh sau.\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Dịch sang tiếng Việt tự nhiên, sát nghĩa, nhưng vẫn giữ đúng sắc thái gốc.\n";
        prompt += "2. Giữ nguyên các từ khóa tiếng Anh nếu mang nghĩa chuyên ngành.\n";
        prompt += "3. Không cần giải thích hay phân tích gì thêm.\n";
        prompt += "Văn bản cần dịch:\n";
    }
    else if (toolType === AI_PROMPT_TYPE.EXPLAIN_BASIC) {
        prompt += "Hãy phân tích kỹ đoạn văn bản sau.\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Đưa ra nội dung chính và ý nghĩa của đoạn văn.\n";
        prompt += "2. Giải thích các thuật ngữ hoặc khái niệm quan trọng nếu có.\n";
        prompt += "3. Trình bày hoàn toàn bằng tiếng Việt, rõ ràng, dễ hiểu.\n";
        prompt += "Văn bản cần giải thích:\n";
    } else if (toolType === AI_PROMPT_TYPE.EXPLAIN_PHRASE) {
        prompt += "Tôi muốn bạn đóng vai trò là giáo viên tiếng Anh. Hãy giúp tôi phân tích và dịch từ/cụm từ sau theo phong cách dễ hiểu và sát với ngữ cảnh người học.\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Dịch sang tiếng Việt tự nhiên.\n";
        prompt += "2. Giải thích ý nghĩa và cách dùng bằng tiếng Anh đơn giản.\n";
        prompt += "3. Cho biết từ loại.\n";
        prompt += "4. Đưa ra 1–2 ví dụ cụ thể trong câu.\n";
        prompt += "Từ/cụm từ: \n";
    }
    else if (toolType === AI_PROMPT_TYPE.EXPLAIN_CLOUD_SERVICE) {
        prompt += "Tôi muốn bạn đóng vai trò là chuyên gia trong lĩnh vực aws. Hãy giúp tôi phân tích cụm từ sau:\n";
        prompt += "Yêu cầu:\n";
        prompt += "1. Giải thích ý nghĩa trong ngữ cảnh AWS.\n";
        prompt += "Cụm từ: \n";
    }
    else if (toolType === AI_PROMPT_TYPE.CREATE_MEANING) {
        prompt += `Cho tôi 1-3 nghĩa ngắn gọn, đơn giản nhất của từ bên dưới.\n`;
        prompt += "Yêu cầu:\n";
        prompt += "1. Cách nhau bằng dấu phẩy.\n";
        prompt += "2. Không cần ví dụ.\n";
        prompt += "3. Ngữ cảnh trong công nghệ, cuộc sống.\n";

    }

    prompt += content;

    return stripHtml(prompt);
}
