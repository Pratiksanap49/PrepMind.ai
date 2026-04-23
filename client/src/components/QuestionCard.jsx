import { Card, CardContent } from "@/components/ui/card";

export default function QuestionCard({ questionText, questionNumber, totalQuestions }) {
  return (
    <Card className="border-border bg-gray-900">
      <CardContent className="p-6">
        <p className="mb-2 text-sm text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </p>
        <p className="text-lg text-white">{questionText}</p>
      </CardContent>
    </Card>
  );
}
