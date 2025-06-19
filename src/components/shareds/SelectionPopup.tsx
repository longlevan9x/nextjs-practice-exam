"use client";

import { CursorArrowRaysIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

export default function SelectionPopup() {
    const [showButton, setShowButton] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [showPopup, setShowPopup] = useState(false);

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


    const handleMouseUp = () => {
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
    };

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <>
            {showButton && (
                <button
                    className="cursor-pointer absolute z-50 p-2 rounded-full shadow-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    style={{ top: buttonPosition.y - 35, left: buttonPosition.x }}
                    onClick={() => setShowPopup(true)}
                >
                    <CursorArrowRaysIcon className="w-4 h-4" />
                </button>
            )}

            {showPopup && (
                <div style={{ top: buttonPosition.y - 40, left: buttonPosition.x }}
                    id="selection-popup"
                    className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 w-[300px]">
                    <button
                        className="cursor-pointer absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setShowPopup(false)}
                        aria-label="Đóng popup"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <h2 className="font-bold mb-2 text-gray-900 dark:text-white">Nội dung đã chọn</h2>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{selectedText}</p>

                    <div className="flex justify-end">
                        <button
                            className="cursor-pointer mt-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                            onClick={() => setShowPopup(false)}
                        >
                            Đóng
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}
