'use client';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/components/contexts/ModalContext';
import { useWindowMessage } from '@/hooks/useWindowMessage'; // hook bạn đang dùng
import { EVENT_ACTION } from '@/constants/windowMessage';
import { windowPostMessage } from '@/services/windowMessageService';
import ReactMarkdown from 'react-markdown';

interface AskChatGPTModalProps {
    content?: string;
    toolType: string
}

const AskAIChatGPTModal: React.FC<AskChatGPTModalProps> = ({ toolType, content = '' }) => {
    const { closeModal } = useModal();
    const didRun = useRef(false);

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
            prompt += "Không làm gì nhiều hơn. Chỉ cần dịch đoạn văn bản bên dưới sang tiếng việt cho tôi. \n";
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
            <h2 className="text-xl font-bold">Gửi câu hỏi đến AI</h2>

            <div className={`ai-content-wrapper overflow-auto max-h-[calc(100vh-150px)] p-2 border border-gray-200 dark:border-gray-700 rounded-xs bg-gray-50 dark:bg-gray-900 text-sm flex-grow`}>
                <ReactMarkdown>{streamText}</ReactMarkdown>
            </div>

            <div className="text-right mt-auto">
                <button
                    onClick={closeModal}
                    className="text-sm cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                    Đóng
                </button>
            </div>
        </div>

    );
};

export default AskAIChatGPTModal;