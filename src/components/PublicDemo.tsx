import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { PublicQualityScoreFixed } from './PublicQualityScoreFixed';
import { 
  ExternalLink, 
  Eye, 
  Share2, 
  ArrowLeft,
  PlayCircle
} from 'lucide-react';

export function PublicDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedShareId, setSelectedShareId] = useState('demo-results');

  // Links de exemplo para QualityScore - Simplificado
  const scoreLinks = [
    {
      id: 'demo-results',
      company: 'Demo Company',
      title: 'Quality Assessment Demo',
      url: '/score/demo-results',
      score: 3.2,
      level: 'Consciência'
    }
  ];

  const openPublicLink = (shareId: string) => {
    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=score/${shareId}`;
    window.open(demoUrl, '_blank');
  };

  if (showDemo) {
    const currentLink = scoreLinks.find(l => l.id === selectedShareId);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDemo(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Preview: {currentLink?.company}</span>
            </div>
            
            <Button
              onClick={() => openPublicLink(selectedShareId)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Nova Aba
            </Button>
          </div>
        </div>

        <PublicQualityScoreFixed shareId={selectedShareId} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl">Demo Público</h2>
        <p className="text-muted-foreground">
          Visualize a página pública de compartilhamento do QualityScore
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como Acessar</CardTitle>
          <CardDescription>
            Formas de visualizar a demo pública
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              1
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">URL Direta</div>
              <code className="text-xs bg-background p-1 rounded block">
                /score/demo-results
              </code>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              2
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Parâmetro URL</div>
              <code className="text-xs bg-background p-1 rounded block">
                ?demo=score/demo-results
              </code>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              3
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">Preview Interno</div>
              <div className="text-sm text-muted-foreground">
                Use o botão abaixo para visualizar
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {scoreLinks.map((link) => (
        <Card key={link.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{link.company}</CardTitle>
                <CardDescription>{link.title}</CardDescription>
              </div>
              <Badge variant="outline">{link.level}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl text-primary">
                    {link.score}
                  </div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">URL Pública</div>
                  <code className="text-xs bg-background px-2 py-1 rounded">
                    {link.url}
                  </code>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setSelectedShareId(link.id);
                  setShowDemo(true);
                }}
                className="flex-1"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Ver Preview
              </Button>
              
              <Button
                variant="outline"
                onClick={() => openPublicLink(link.id)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Nova Aba
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const url = `${window.location.origin}${link.url}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}