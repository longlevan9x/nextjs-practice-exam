import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getIncompleteExamResult } from '@/services/examResultService';

export const useExamRedirect = () => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAndRedirect = async () => {
            // Only check for exam detail pages
            if (pathname.startsWith('/exams/')) {
                const examId = pathname.split('/')[2];

            // Skip if it's not a valid exam ID or if it's already an exam/practice page
            if ([`/exams/${examId}/exam`, `/exams/${examId}/practice`].includes(pathname)) {
                return;
            }

            // Check for incomplete exams
            const incompleteExam = await getIncompleteExamResult(examId);
            
            if (incompleteExam) {
                // Redirect to the appropriate mode based on examType
                const redirectUrl = `/exams/${examId}/${incompleteExam.examType}`;
                    router.push(redirectUrl);
                }
            }
        };

        checkAndRedirect();
    }, [pathname, router]);
}; 