'use client'

import React, { useEffect, useState } from 'react';
import { Exam } from '@/types/exam';
import { ClockIcon } from '@heroicons/react/24/outline';
import { getIncompleteExamResults } from '@/services/examResultService';
import { getExams } from '@/services/examService';
import Loading from '@/components/loading/Loading';
import SharedExamCard from '../shareds/ExamCard';

const InProgressList: React.FC = () => {
    const [inProgressExams, setInProgressExams] = useState<Exam[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInProgressExams = async () => {
            const incompleteExamResults = await getIncompleteExamResults();
            let _exams = getExams();
            _exams = _exams.map(exam => {
                const incompleteExam = incompleteExamResults.find(result => result.examId === exam.id);
                const examType = incompleteExam?.examType;

                return {
                    ...exam,
                    incomplete: incompleteExam?.isCompleted === false,
                    examType
                };
            }).filter(exam => exam.incomplete);

            setInProgressExams(_exams);
            setLoading(false);
        };

        fetchInProgressExams();
    }, []);

    if (loading) {
        return <Loading />
    }

    if (inProgressExams.length === 0) {
        return (<></>);
    }

    return (
        <div className="xl:container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold  mb-4 flex items-center">
                <ClockIcon className="w-7 h-7 mr-2 text-blue-600" />
                Đề thi đang làm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressExams.map((exam) => (
                    <SharedExamCard exam={exam} key={exam.id} />
                ))}
            </div>
        </div>
    );
};

export default InProgressList; 