'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Exam } from "@/types/exam";
import { useParams, useRouter } from "next/navigation";

export default function ExamDetailPage() {
  const { id } = useParams<{id: string}>(); // Get the "id" parameter from the URL
  const router = useRouter(); // For navigation
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const response = await import("@/data/exams.json");
        const examData = response.default.find(
          (exam: Exam) => exam.id === parseInt(id)
        );
        if (examData) {
          setExam(examData);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load exam details:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-blue-600 text-lg">Loading exam details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">
          Failed to load exam details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Exam Details Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Exam Logo */}
        <div className="flex justify-center mb-6">
          <Image
            width={128}
            height={128}
            src={exam.imageUrl}
            alt={exam.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* Exam Name */}
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">
          {exam.name}
        </h2>

        {/* Exam Description */}
        <p className="text-gray-600 text-lg text-center mb-6">
          {exam.description}
        </p>

        {/* Updated At */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Last Updated</h3>
          <p className="text-gray-500">{exam.updatedAt}</p>
        </div>

        {/* Categories */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Categories
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {exam.categories.map((category, index) => (
              <li key={index} className="text-gray-600">
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          {/* Exam Mode Button */}
          <button
            onClick={() => router.push(`${id}/exam`)}
            className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full md:w-auto"
          >
            Start Exam Mode
          </button>

          {/* Practice Mode Button */}
          <button
            onClick={() => router.push(`${id}/practice`)}
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 w-full md:w-auto"
          >
            Start Practice Mode
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
        >
          Back to Exams
        </a>
      </div>
    </>
  );
}