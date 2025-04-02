'use client';
import React from "react";
import { useParams } from "next/navigation";

export default function PracticeModePage() {
  const { examId } = useParams(); // Get the examId from the URL

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Practice Mode
        </h1>
        <p className="text-gray-600 text-center mb-6">
          You are now practicing the exam without restrictions.
        </p>
        <p className="text-gray-500 text-center">Exam ID: {examId}</p>
      </div>
    </div>
  );
}