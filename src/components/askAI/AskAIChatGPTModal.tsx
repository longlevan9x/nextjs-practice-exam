'use client';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/components/contexts/ModalContext';
import { useWindowMessage } from '@/hooks/useWindowMessage'; // hook bạn đang dùng
import { EVENT_ACTION } from '@/constants/windowMessage';
import { windowPostMessage } from '@/services/windowMessageService';
import ReactMarkdown from 'react-markdown';
import { EXT_VERSION } from '@/constants/extension';
import { getExtVersion } from '@/services/localStorageService';
import Link from 'next/link';
import { EXT_RELEASE_LINK } from '@/configs/config';

interface AskChatGPTModalProps {
    content?: string;
    toolType: string
}

const AskAIChatGPTModal: React.FC<AskChatGPTModalProps> = ({ toolType, content = '' }) => {
    const { closeModal } = useModal();
    const didRun = useRef(false);
    const [isNeedUpgradeExt, setIsNeedUpgradeExt] = useState<boolean>(false);
    const requireVersion = EXT_VERSION;
    const [streamText, setStreamText] = useState('');

    const gptPayload = useWindowMessage<{ content: string }>(EVENT_ACTION.GPT_STREAM_PART);
    const fullContentRef = useRef(""); // giữ nội dung đầy đủ
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (gptPayload?.content) {
            fullContentRef.current += gptPayload.content;

            if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(() => {
                    setStreamText(fullContentRef.current);
                    timeoutRef.current = null;
                }, 100); // chỉ update 10 lần mỗi giây
            }
        }
    }, [gptPayload]);

    useEffect(() => {
        const currentVersion = getExtVersion();
        if (requireVersion !== currentVersion) {
            setIsNeedUpgradeExt(true);
        }
    }, [isNeedUpgradeExt]);

    function stripHtml(html: string) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    // Gửi prompt khi modal mở ra
    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        setStreamText('');

        let prompt = "";

        if (toolType === "tran") {
            prompt += "Tôi muốn bạn đóng vai trò là chuyên gia ngôn ngữ Anh - Việt. Hãy giúp tôi dịch đoạn tiếng Anh sau.\n";
            prompt += "Yêu cầu:\n";
            prompt += "1. Dịch sang tiếng Việt tự nhiên, sát nghĩa, nhưng vẫn giữ đúng sắc thái gốc.\n";
            prompt += "2. Giữ nguyên các từ khóa tiếng Anh nếu mang nghĩa chuyên ngành.\n";
            prompt += "Văn bản cần dịch:\n";
            // prompt += "Hãy đoạn văn bản bên dưới sang tiếng việt cho tôi. Yêu cầu: \n1. Giữ lại các keywords. \n 2. Những đoạn về code hãy trả về để hiển thị định dạng code được.  \n";
        }
        else if (toolType === "explain") {
            prompt += "Hãy phân tích kỹ câu hỏi trắc nghiệm sau đây. Chủ đề liên quan đến AWS.\n";
            prompt += "Yêu cầu:\n";
            prompt += "1. Đưa ra đáp án đúng trước, chỉ rõ lý do chọn.\n";
            prompt += "2. Giải thích tất cả các phương án (đúng và sai), nêu rõ vì sao đúng, vì sao sai, nếu có ví dụ minh họa thì càng tốt.\n";
            prompt += "3. Sử dụng kiến thức cập nhật mới nhất đến năm 2025 (vui lòng áp dụng theo phiên bản mới nhất).\n";
            prompt += "4. Trình bày hoàn toàn bằng tiếng Việt, rõ ràng, dễ hiểu.\n";
            prompt += "Văn bản cần giải thích:\n";
            // prompt += "Hãy phân tích kỹ. Sử dụng dữ liệu mới nhất. Đầu tiên đưa ra đáp án đúng. Sau đó giải thích các đáp án cho tôi. Giải thích bằng tiếng việt. \n";
        }

        prompt += content;
        prompt = stripHtml(prompt);
        windowPostMessage(EVENT_ACTION.SEND_PROMPT, { prompt: prompt });
    }, [content, toolType]);


    return (
        <div className="flex flex-col w-4xl min-h-96 text-gray-900 dark:text-gray-100 space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-bold">Gửi câu hỏi đến AI</h2>
                {
                    isNeedUpgradeExt &&
                    <p className="text-xs p-1 text-red-700 dark:text-red-300 bg-amber-100 dark:bg-amber-950">
                        Đã có phiên bản mới.
                        <Link className="ml-2 text-blue-400 hover:underline hover:text-blue-500" href={EXT_RELEASE_LINK + requireVersion} target="_blank">Cập nhật ngay</Link>
                    </p>
                }
            </div>

            <div className="w-full border-b border-b-gray-200  dark:border-b-gray-600"></div>
            <div className={`ai-content-wrapper overflow-auto h-[calc(100vh-16rem)]  border-gray-200 dark:border-gray-700 rounded-xs bg-white dark:bg-gray-900 text-sm flex-grow`}>
                <ReactMarkdown>{streamText}</ReactMarkdown>
            </div>

            <div className="text-right mt-auto">
                <button
                    onClick={closeModal}
                    className="text-sm cursor-pointer text-gray-500 dark:text-gray-400 px-3 py-2 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                >
                    Đóng
                </button>
            </div>
        </div>

    );
};

export default AskAIChatGPTModal;