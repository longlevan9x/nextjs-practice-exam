import React, { useEffect, useState } from 'react';
import { ExamResult } from '@/types/ExamResult';
import { Exam, ExamDomain } from '@/types/exam';

interface DomainAnalysisProps {
  examResults: ExamResult[];
  exams: Exam[];
}

interface DomainStat {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  questionCount: number;
}

const DomainAnalysis: React.FC<DomainAnalysisProps> = ({ examResults, exams }) => {
  const [domainStats, setDomainStats] = useState<DomainStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(exams);


    const fetchDomainStats = async () => {
      try {
        setLoading(true);
        
        // Get unique domains from filtered exams
        const uniqueDomains = new Map<string, ExamDomain>();
        
        exams.forEach(exam => {
          exam.domains?.forEach(domain => {
            if (uniqueDomains.has(domain.name)) {
              const existingDomain = uniqueDomains.get(domain.name)!;
              existingDomain.questionCount += domain.questionCount;
            } else {
              uniqueDomains.set(domain.name, { ...domain });
            }
          });
        });

        // Calculate statistics for each domain
        const stats = Array.from(uniqueDomains.values()).map(domain => {
          // Get all exam results for this domain
          const domainResults = examResults.filter(result => {
            const exam = exams.find(e => e.id === result.examId);
            return exam?.domains?.some(d => d.name === domain.name);
          });

          // Calculate total questions for this domain across all selected exams
          const totalQuestions = domainResults.reduce((sum, result) => {
            const exam = exams.find(e => e.id === result.examId);
            const domainInExam = exam?.domains?.find(d => d.name === domain.name);
            return sum + (domainInExam?.questionCount || 0);
          }, 0);

          // Calculate correct answers for this domain
          const correctAnswers = domainResults.reduce((sum, result) => {
            return sum + (result.questions?.filter(q => q.isCorrect).length || 0);
          }, 0);

          // Calculate accuracy
          const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

          return {
            name: domain.name,
            totalQuestions,
            correctAnswers,
            accuracy,
            questionCount: domain.questionCount
          };
        });

        setDomainStats(stats);
      } catch (error) {
        console.error('Error calculating domain stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDomainStats();
  }, [examResults, exams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {domainStats.map((domain, index) => (
        <div key={index} className="border rounded-lg p-3">
          <div className="flex justify-between items-center mb-1.5">
            <h3 className="text-base font-semibold text-gray-800">{domain.name}</h3>
            <span className="text-sm text-gray-500">
              {domain.correctAnswers}/{domain.totalQuestions} câu đúng
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${domain.accuracy}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-1.5">
            <span className="text-sm text-gray-600">
              Tổng số câu hỏi: {domain.questionCount}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {domain.accuracy.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DomainAnalysis; 