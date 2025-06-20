"use client";

import { ArchiveBoxArrowDownIcon, GlobeAltIcon, MagnifyingGlassCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useState } from "react";
import AskAIChatGPTModal from "@/components/askAI/AskAIChatGPTModal";
import { useModal } from "@/components/contexts/ModalContext";
import AddNote from "@/components/shareds/AddNote";
import { AI_PROMPT_TYPE } from "@/constants/ai";

export default function SelectionPopup() {
    const [showButton, setShowButton] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [openMenuLeft, setOpenMenuLeft] = useState(false);
    const { showModal } = useModal();

    function findScrollableParent(node: Node | null): HTMLElement {
        let el = node as HTMLElement | null;

        while (el && el !== document.body) {
            // Nếu node hiện tại không phải là Element (ví dụ TextNode), đi lên
            if (el.nodeType !== 1) {
                el = el.parentElement;
                continue;
            }

            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;

            if (overflowY === "auto" || overflowY === "scroll") {
                return el;
            }

            el = el.parentElement;
        }

        return document.body; // fallback
    }

    const handleMouseUp = useCallback(() => {
        const selection = window.getSelection();

        if (!selection) {
            return;
        }

        // Kiểm tra nếu đang bôi đen bên trong popup
        const popupEl = document.getElementById("selection-popup");
        const isInsidePopup = popupEl?.contains(selection.anchorNode);

        if (isInsidePopup) {
            // 👉 Nếu popup đang mở và bôi đen bên trong, không cập nhật gì cả
            return;
        }

        const text = selection?.toString();

        if (!text || text.trim().length === 0) {
            setShowButton(false);
            return;
        }

        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        // 🔍 Tự động tìm scrollable container
        const scrollable = findScrollableParent(selection.anchorNode);
        const containerRect = scrollable?.getBoundingClientRect();

        if (!rect) {
            return;
        }

        // Tính tọa độ tương đối so với scrollable container
        const offsetX = rect.right - containerRect.left + scrollable.scrollLeft;
        const offsetY = rect.top - containerRect.top + scrollable.scrollTop;

        setButtonPosition({ x: offsetX / 2, y: offsetY });
        setSelectedText(text);
        setShowButton(true);
    }, []);


    const handleShowChatGptModal = (sendOption: string) => {
        const toolType = sendOption;
        const content = selectedText;

        if (!content) return;

        showModal(<AskAIChatGPTModal toolType={toolType} content={content} />);
    }

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseUp]);

    const handleOpenAddNoteModal = () => {
        showModal(<AddNote text={selectedText} />);
    }

    return (
        <>
            {showButton && (
                <div>
                    <div className="relative"
                        onMouseEnter={() => setOpenMenuLeft(true)}
                        onMouseLeave={() => setOpenMenuLeft(false)}>
                        <div className="absolute z-50 p-2" style={{ top: buttonPosition.y - 70, left: buttonPosition.x }}>
                            <div className="relative">
                                <div className="cursor-pointer p-2 rounded-full shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    <CursorArrowRaysIcon className="w-4 h-4" />
                                </div>
                                {openMenuLeft && (
                                    <div className="w-44 top-0 left-9 absolute z-50 border border-gray-200 dark:border-gray-700 rounded-xs bg-white text-gray-800 dark:bg-gray-800 dark:text-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0">
                                        <a className="flex items-center px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                                            href="#"
                                            onClick={() => handleShowChatGptModal(AI_PROMPT_TYPE.TRAN_BASIC)}>
                                            <GlobeAltIcon className="w-4 h-4 text-gray-500 dark:text-white mr-1" />
                                            <p className="text-gray-900 dark:text-white">Dịch nội dung</p>
                                        </a>
                                        <a className="flex items-center px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                                            href="#"
                                            onClick={() => handleShowChatGptModal(AI_PROMPT_TYPE.EXPLAIN_BASIC)}>
                                            <MagnifyingGlassCircleIcon className="w-4 h-4 text-gray-500 dark:text-white mr-1" />
                                            <p className="text-gray-900 dark:text-white">Phân tích nội dung</p>
                                        </a>
                                        <a className="flex items-center px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                                            href="#"
                                            onClick={() => handleShowChatGptModal(AI_PROMPT_TYPE.CUSTOM)}>
                                            <SparklesIcon className="w-4 h-4 text-gray-500 dark:text-white mr-1" />
                                            <p className="text-gray-900 dark:text-white">AI Tùy chỉnh</p>
                                        </a>
                                        <a className="flex items-center px-3 py-2 transition hover:bg-gray-100 dark:hover:bg-white/5"
                                            href="#"
                                            onClick={() => handleOpenAddNoteModal()}>
                                            <ArchiveBoxArrowDownIcon className="w-4 h-4 text-gray-500 dark:text-white mr-1" />
                                            <p className="text-gray-900 dark:text-white">Lưu ghi chú</p>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
