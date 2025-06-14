'use client';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/components/contexts/ModalContext';
import { useWindowMessage } from '@/hooks/useWindowMessage'; // hook bạn đang dùng
import { EVENT_ACTION } from '@/constants/windowMessage';
import { windowPostMessage } from '@/services/windowMessageService';
import ReactMarkdown from 'react-markdown';
import { EXT_VERSION } from '@/constants/extension';
import { getExtVersion } from '@/services/localStorageService';

interface AskChatGPTModalProps {
    content?: string;
    toolType: string
}

const AskAIChatGPTModal: React.FC<AskChatGPTModalProps> = ({ toolType, content = '' }) => {
    const { closeModal } = useModal();
    const didRun = useRef(false);
    const [isNeedUpgradeExt, setIsNeedUpgradeExt] = useState<boolean>(false);

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
        const requireVersion = EXT_VERSION;
        const currentVersion = getExtVersion();
        if (requireVersion !== currentVersion) {
            setIsNeedUpgradeExt(true);
        }
    });

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
            prompt += "Hãy đoạn văn bản bên dưới sang tiếng việt cho tôi. Những đoạn về code hãy trả về để hiển thị định dạng code được.  \n";
        }
        else if (toolType === "explain") {
            prompt += "Hãy phân tích kỹ. Sử dụng dữ liệu mới nhất. Đầu tiên đưa ra đáp án đúng. Sau đó giải thích các đáp án cho tôi. Giải thích bằng tiếng việt. \n";
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
                    <p className="text-xs p-1 text-red-700 dark:text-red-300 bg-amber-100 dark:bg-amber-950">Phiên bản extension đã cũ. Cần cập nhật phiên bản mới.</p>
                }
            </div>

            <div className="w-full border-b border-b-gray-200  dark:border-b-gray-600"></div>
            <div className={`ai-content-wrapper overflow-auto max-h-[calc(100vh-150px)]  border-gray-200 dark:border-gray-700 rounded-xs bg-white dark:bg-gray-900 text-sm flex-grow`}>
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