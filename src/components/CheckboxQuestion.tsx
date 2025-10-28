import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface CheckboxQuestionProps {
  questionId: string;
  options?: string[];
  value?: string[];
  onChange: (questionId: string, value: string[]) => void;
}

export function CheckboxQuestion({ questionId, options = [], value = [], onChange }: CheckboxQuestionProps) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const newValue = checked
      ? [...value, option]
      : value.filter(v => v !== option);
    onChange(questionId, newValue);
  };

  // Validação de segurança para garantir que options é um array
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {safeOptions.map((option) => (
          <div key={option} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Checkbox
              id={`${questionId}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
            />
            <Label
              htmlFor={`${questionId}-${option}`}
              className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
      
      {value.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-2">
            Modalidades selecionadas ({value.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((selectedOption) => (
              <span
                key={selectedOption}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
              >
                {selectedOption}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}