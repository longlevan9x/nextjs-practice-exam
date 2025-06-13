"use client";

import { useEffect, useState } from "react";
import { windowPostMessage } from "@/services/windowMessageService";
import { useWindowMessage } from "@/hooks/useWindowMessage";
import { EVENT_ACTION } from "@/constants/windowMessage";
import { setExtVersion } from "@/services/localStorageService";

export default function CheckExtensionInstalled() {
    const installedPayload = useWindowMessage(EVENT_ACTION.EXT_PRESENT);
    const [checked, setChecked] = useState<boolean>(false);
    const [checkedExtVersion, setCheckedExtVersion] = useState<string>();

    useEffect(() => {
        if (!checked) {
            windowPostMessage(EVENT_ACTION.EXT_CHECK);

            // Sau 1.5s nếu vẫn chưa nhận được version, set version rỗng
            const timer = setTimeout(() => {
                if (!checkedExtVersion) {
                    setExtVersion("");
                    setChecked(true);
                }
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [checked, checkedExtVersion]);

    useEffect(() => {
        if (installedPayload?.version) {
            setExtVersion(installedPayload.version);
            setCheckedExtVersion(installedPayload.version);
            setChecked(true);
        }
    }, [installedPayload]);


    return null; // không render gì cả
}
