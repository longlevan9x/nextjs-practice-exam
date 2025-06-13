'use client';

import ExamPracticeLayout from "@/components/examDetail/ExamPracticeLayout";
import Loading from "@/components/loading/Loading";
import { EXAM_TYPES, DISPLAY_MODES } from "@/constants/exam";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { checkAuth } from "@/services/authService";

export default function PracticeModePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  // get current url
  const currentUrl = usePathname();

  useEffect(() => {
    checkAuth(router, currentUrl).then((isAuthenticated) => {
      if (isAuthenticated) {
        setIsLoading(false);
      }
    }).catch(err => {
      console.log(err);
      router.push("/login");
    });
  }, [router, currentUrl]);

  if (isLoading) {
    return <Loading />;
  }

  return <ExamPracticeLayout examType={EXAM_TYPES.PRACTICE} displayMode={DISPLAY_MODES.EXECUTE} />;
}
