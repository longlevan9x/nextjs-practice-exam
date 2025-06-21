import React, { useEffect, useRef, useState } from 'react';
import { useModal } from '@/components/contexts/ModalContext';
import { addNote } from '@/services/noteService';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { buildDefaultPrompt } from '@/utils/prompt';
import { AI_PROMPT_TYPE } from '@/constants/ai';
import { EVENT_ACTION } from '@/constants/windowMessage';
import { sendPromptToExtension } from '@/services/windowMessageService';
import { useWindowMessage } from '@/hooks/useWindowMessage';
import LoadingIcon from '@/components/common/LoadingIcon';

interface AddNoteProps {
    text: string;
}

const AddNote: React.FC<AddNoteProps> = ({ text }) => {
    const { closeModal } = useModal();
    const [noteExplain, setNoteExplain] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [isAIPrompting, setIsAIPrompting] = useState(false);

    const gptPayload = useWindowMessage<{ content: string }>(EVENT_ACTION.GPT_STREAM_PART);
    const fullContentRef = useRef(""); // giữ nội dung đầy đủ
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (gptPayload?.content) {
            fullContentRef.current += gptPayload.content;

            if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(() => {
                    setNoteExplain(fullContentRef.current);
                    timeoutRef.current = null;
                }, 100); // chỉ update 10 lần mỗi giây
            }
        }
    }, [gptPayload]);

    const handleSaveNote = async () => {
        try {
            setErrors([]); // Reset errors before validation
            if (noteExplain.trim() === "") {
                setErrors((prev) => [...prev, 'Nội dung ghi chú không được để trống.']);
                return;
            }

            setIsLoading(true);
            await addNote(text, noteExplain);
            closeModal();
        } catch (error) {
            console.error('Error:', error)
            setErrors((prev) => [...prev, 'Đã xảy ra lỗi khi lưu ghi chú.']);
        } finally {
            setIsLoading(false);
        }
    }

    const onCallAI = () => {
        if (isAIPrompting) return; // Prevent multiple calls
        setIsAIPrompting(true);
        setNoteExplain(""); // Reset noteExplain before calling AI
        fullContentRef.current = ""; // Reset full content
        timeoutRef.current = null; // Reset timeout
        const prompt = buildDefaultPrompt(AI_PROMPT_TYPE.CREATE_MEANING, text);
        sendPromptToExtension({ prompt });
        setTimeout(() => {
            setIsAIPrompting(false);
        }, 1500); // Reset isAIPrompting after 1.5 seconds
    }

    return (
        <div
            id="selection-popup"
            className="flex flex-col justify-between w-md h-72 text-gray-900 dark:text-gray-100"
        >
            {/* Nội dung chính */}
            <div className="space-y-4 overflow-auto">
                <h2 className="font-bold text-gray-900 dark:text-white">Lưu ghi chú</h2>

                {errors.length > 0 && (
                    <div className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 p-2 rounded-xs mb-2">
                        {errors.map((error, index) => (
                            <p key={index} className="text-sm">{error}</p>
                        ))}
                    </div>
                )}

                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {text}
                </p>

                <div className="relative w-full">
                    <input
                        type="text"
                        value={noteExplain}
                        onChange={(e) => setNoteExplain(e.target.value)}
                        placeholder="Nội dung ghi chú..."
                        className="w-full pr-10 px-3 py-2 text-sm rounded-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={onCallAI}
                        className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 dark:hover:text-blue-300 hover:text-blue-700 text-gray-500 dark:text-white"
                        aria-label="Call AI"
                    >
                        <SparklesIcon className="h-5 w-5 " />
                    </button>
                </div>
            </div>

            {/* Nút ở cuối */}
            <div className="flex justify-end gap-2 pt-4">
                <button
                    className="cursor-pointer px-3 py-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-xs"
                    onClick={closeModal}
                >
                    Đóng
                </button>
                <button
                    className="flex cursor-pointer px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xs"
                    onClick={handleSaveNote}
                    disabled={isLoading}
                >
                    Lưu
                    {
                        isLoading &&
                        <LoadingIcon className="w-3 h-3 text-white" />
                    }
                </button>
            </div>
        </div>
    );
};

export default AddNote;