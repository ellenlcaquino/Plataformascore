import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

interface QualityScoreLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  title: string;
  description?: string;
}

const getSectionName = (section: string): string => {
  switch (section) {
    case 'qualityscore-formulario':
      return 'Formulário';
    case 'qualityscore-progresso':
      return 'Progresso';
    case 'qualityscore-resultados':
      return 'Resultados';
    case 'qualityscore-importar':
      return 'Importar';
    default:
      return 'QualityScore';
  }
};

export function QualityScoreLayout({ children, currentSection, title, description }: QualityScoreLayoutProps) {
  const sectionName = getSectionName(currentSection);

  return (
    <div className="min-h-full bg-slate-50/30">
      {/* Header with Breadcrumb */}
      <div className="bg-white border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">QualityScore</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{sectionName}</span>
        </div>
        
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}