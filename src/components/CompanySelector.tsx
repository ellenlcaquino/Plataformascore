import React, { useState } from 'react';
import { Building2, ChevronDown, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useCompany } from './CompanyContext';
import { useAuth } from './AuthContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

export function CompanySelector() {
  const [open, setOpen] = useState(false);
  const { selectedCompany, availableCompanies, selectCompany, clearCompanySelection, isWhitelabelMode } = useCompany();
  const { user } = useAuth();

  // Só mostra para System Managers
  if (!user || user.role !== 'manager') {
    return null;
  }

  const handleCompanySelect = (company: typeof availableCompanies[0]) => {
    selectCompany(company);
    setOpen(false);
  };

  const handleClearSelection = () => {
    clearCompanySelection();
    setOpen(false);
  };

  return (
    <div className="p-4 border-b border-border/50 bg-gradient-to-r from-slate-50 to-blue-50/30">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Empresa Selecionada
        </div>
        {isWhitelabelMode && (
          <Badge variant="secondary" className="text-xs">
            Modo Whitelabel
          </Badge>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isWhitelabelMode ? "default" : "outline"}
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${
              isWhitelabelMode 
                ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20' 
                : 'hover:bg-accent'
            }`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <div className="text-left truncate">
                {selectedCompany ? (
                  <div className="font-medium truncate">{selectedCompany.name}</div>
                ) : (
                  <span className="text-muted-foreground">Selecionar empresa...</span>
                )}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar empresa..." />
            <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {selectedCompany && (
                  <CommandItem
                    key="clear-selection"
                    onSelect={handleClearSelection}
                    className="text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Limpar seleção
                  </CommandItem>
                )}
                
                {availableCompanies.map((company) => (
                  <CommandItem
                    key={company.id}
                    onSelect={() => handleCompanySelect(company)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{company.name}</div>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                      style={{ backgroundColor: company.primaryColor }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>


    </div>
  );
}