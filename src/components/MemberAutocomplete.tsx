import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { User, Mail, Briefcase, Check } from 'lucide-react';
import { User as UserType } from '../hooks/useUsersDB';

interface MemberAutocompleteProps {
  companyId: string;
  members: UserType[];
  value: string;
  onSelect: (member: UserType) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MemberAutocomplete({
  companyId,
  members,
  value,
  onSelect,
  onChange,
  placeholder = "Nome ou email...",
  disabled = false
}: MemberAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<UserType[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrar membros da mesma empresa
  const companyMembers = members.filter(m => m.companyId === companyId);

  // Filtrar baseado no input
  useEffect(() => {
    if (!value || value.length < 1) {
      setFilteredMembers([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = companyMembers.filter(member => 
      member.name.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.role.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limitar a 5 sugestões

    setFilteredMembers(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [value, companyId, members]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (member: UserType) => {
    onSelect(member);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (filteredMembers.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-8"
      />

      {showSuggestions && filteredMembers.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 p-0 max-h-60 overflow-y-auto shadow-lg border-2">
          <div className="py-1">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelect(member)}
                className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {member.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-2">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              </button>
            ))}
          </div>
          
          {companyMembers.length > 0 && (
            <div className="px-3 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
              {filteredMembers.length} de {companyMembers.length} membros • Clique para selecionar ou continue digitando
            </div>
          )}
        </Card>
      )}


    </div>
  );
}
