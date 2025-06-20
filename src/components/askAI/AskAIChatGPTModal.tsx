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
import { AI_PROMPT_TYPE } from '@/constants/ai';
import { buildDefaultPrompt } from '@/utils/prompt';

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
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [hasSentPrompt, setHasSentPrompt] = useState(false);

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

    const handleSendPrompt = () => {
        if (!customPrompt.trim() || hasSentPrompt) {
            return;
        }

        setStreamText('');
        setHasSentPrompt(true);

        const promptToSend = customPrompt.trim() + '\n\n' + content;
        windowPostMessage(EVENT_ACTION.SEND_PROMPT, { prompt: promptToSend });
    };

    useEffect(() => {
        const currentVersion = getExtVersion();
        if (requireVersion !== currentVersion) {
            setIsNeedUpgradeExt(true);
        }
    }, [isNeedUpgradeExt, requireVersion]);


    // Gửi prompt khi modal mở ra
    useEffect(() => {

        if (didRun.current) return;
        didRun.current = true;

        if (toolType === AI_PROMPT_TYPE.CUSTOM) {
            // Nếu là prompt tùy chỉnh, không gửi gì cả
            return;
        }

        setStreamText('');

        const prompt = buildDefaultPrompt(toolType, content);
        windowPostMessage(EVENT_ACTION.SEND_PROMPT, { prompt });
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
                {toolType === AI_PROMPT_TYPE.CUSTOM && (
                    <div className="mb-4">
                        <textarea
                            className="w-full border rounded p-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
                            rows={3}
                            placeholder="Nhập prompt tùy chỉnh (hoặc để trống để dùng prompt mặc định)..."
                            value={customPrompt}
                            onChange={e => setCustomPrompt(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSendPrompt}
                                disabled={!customPrompt.trim() || hasSentPrompt}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                )}

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