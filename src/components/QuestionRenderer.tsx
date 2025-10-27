import React from 'react';
import { CheckboxQuestion } from './CheckboxQuestion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'radio' | 'scale' | 'select' | 'checkbox';
  category: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface QuestionRendererProps {
  question: Question;
  answer: any;
  onAnswerChange: (questionId: string, value: any) => void;
}

const RATING_OPTIONS = [
  { value: 0, label: 'Não implementado', color: 'gray', description: 'Conceito conhecido mas não aplicado.' },
  { value: 1, label: 'Início da implementação', color: 'red', description: 'Começando a ser implementado.' },
  { value: 2, label: 'Implementado de forma básica', color: 'orange', description: 'Implementado de forma básica.' },
  { value: 3, label: 'Implementado de forma moderada', color: 'yellow', description: 'Implementado de forma moderada.' },
  { value: 4, label: 'Bem implementado', color: 'blue', description: 'Bem implementado e efetivo.' },
  { value: 5, label: 'Totalmente implementado e otimizado', color: 'green', description: 'Totalmente implementado e otimizado.' }
];

const getColorClass = (color: string) => {
  switch (color) {
    case 'gray': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'red': return 'bg-red-100 text-red-700 border-red-300';
    case 'orange': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'blue': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'green': return 'bg-green-100 text-green-700 border-green-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export function QuestionRenderer({ question, answer, onAnswerChange }: QuestionRendererProps) {
  if (question.type === 'checkbox' && question.options) {
    return (
      <CheckboxQuestion
        questionId={question.id}
        options={question.options}
        value={answer || []}
        onChange={onAnswerChange}
      />
    );
  }

  if (question.type === 'scale') {
    return (
      <div className="space-y-4">
        <RadioGroup
          value={answer?.toString()}
          onValueChange={(value) => onAnswerChange(question.id, parseInt(value))}
        >
          {RATING_OPTIONS.map((option) => (
            <div key={option.value} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${question.id}-${option.value}`}
                />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    answer === option.value
                      ? getColorClass(option.color)
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{option.value} - {option.label}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // Para outros tipos de pergunta, retornar null ou implementar conforme necessário
  return null;
}