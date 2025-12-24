import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

type QuestionType = 'short_answer' | 'long_answer' | 'multiple_choice' | 'yes_no';

export type Question = {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options: string[];
};

type Props = {
  questions: Question[];
  onChange: (questions: Question[]) => void;
};

export default function CustomQuestionsEditor({ questions, onChange }: Props) {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'long_answer', label: 'Long Answer (Paragraph)' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'yes_no', label: 'Yes/No' },
  ];

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'short_answer',
      question: '',
      required: true,
      options: [],
    };
    onChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (
    id: string,
    field: keyof Omit<Question, 'id'>,
    value: string | boolean | string[]
  ) => {
    onChange(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId: string) => {
    onChange(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    onChange(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };

  const removeOption = (questionId: string, index: number) => {
    onChange(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.filter((_, i) => i !== index) } : q
      )
    );
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Application Questions</h3>
          <p className="text-sm text-gray-500 mt-1">Add custom questions for applicants to answer</p>
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="mt-3 cursor-move">
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(question.id, 'type', e.target.value as QuestionType)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    {questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      className="rounded"
                    />
                    Required
                  </label>
                </div>

                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />

                {question.type === 'multiple_choice' && (
                  <div className="space-y-2 ml-8">
                    <p className="text-sm font-medium text-gray-700">Options:</p>
                    {question.options.map((option, optIndex) => (
                      <div key={`${question.id}-opt-${optIndex}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          className="flex-1 px-3 py-2 border rounded-md text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, optIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      + Add Option
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(question.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No custom questions added yet.</p>
          <p className="text-sm mt-1">Click "Add Question" to get started.</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" className="px-6 py-2 border rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button type="button" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Save Questions
        </button>
      </div>
    </div>
  );
}
