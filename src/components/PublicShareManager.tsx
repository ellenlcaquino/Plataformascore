import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Share2, 
  Copy, 
  Eye, 
  EyeOff, 
  Calendar, 
  ExternalLink,
  Settings,
  Trash2,
  Plus
} from 'lucide-react';
import { Switch } from './ui/switch';

interface PublicShare {
  id: string;
  shareId: string;
  title: string;
  company: string;
  createdAt: string;
  isActive: boolean;
  viewCount: number;
  expiresAt?: string;
}

interface PublicShareManagerProps {
  assessmentResults?: any;
  onCreateShare?: (shareData: any) => void;
}

export function PublicShareManager({ assessmentResults, onCreateShare }: PublicShareManagerProps) {
  const [shares, setShares] = useState<PublicShare[]>([
    {
      id: '1',
      shareId: 'irricontrol-r1',
      title: 'QualityScore Assessment Q4 2024',
      company: 'IrriControl',
      createdAt: '2024-12-15',
      isActive: true,
      viewCount: 23,
      expiresAt: '2025-03-15'
    },
    {
      id: '2', 
      shareId: 'techcorp-pilot',
      title: 'Pilot Quality Assessment',
      company: 'TechCorp',
      createdAt: '2024-12-10',
      isActive: false,
      viewCount: 8
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newShareConfig, setNewShareConfig] = useState({
    title: '',
    customShareId: '',
    hasExpiration: false,
    expiresAt: ''
  });

  const generateShareId = (company: string, title: string) => {
    const cleanCompany = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
    return `${cleanCompany}-${cleanTitle}`;
  };

  const getPublicUrl = (shareId: string) => {
    return `${window.location.origin}/score/${shareId}`;
  };

  const handleCopyUrl = async (shareId: string) => {
    const url = getPublicUrl(shareId);
    try {
      await navigator.clipboard.writeText(url);
      // Toast de sucesso seria ideal aqui
    } catch (err) {
      console.error('Erro ao copiar URL:', err);
    }
  };

  const handleShare = async (shareId: string, title: string, company: string) => {
    const url = getPublicUrl(shareId);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${company} - ${title}`,
          text: `Confira os resultados do QualityScore Assessment da ${company}`,
          url: url,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      handleCopyUrl(shareId);
    }
  };

  const handleToggleActive = (id: string) => {
    setShares(prev => prev.map(share => 
      share.id === id ? { ...share, isActive: !share.isActive } : share
    ));
  };

  const handleCreateShare = () => {
    if (!assessmentResults) return;

    const shareId = newShareConfig.customShareId || 
      generateShareId(assessmentResults.company || 'company', newShareConfig.title);

    const newShare: PublicShare = {
      id: Date.now().toString(),
      shareId,
      title: newShareConfig.title,
      company: assessmentResults.company || 'Empresa',
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
      viewCount: 0,
      expiresAt: newShareConfig.hasExpiration ? newShareConfig.expiresAt : undefined
    };

    setShares(prev => [newShare, ...prev]);
    setIsCreating(false);
    setNewShareConfig({
      title: '',
      customShareId: '',
      hasExpiration: false,
      expiresAt: ''
    });

    if (onCreateShare) {
      onCreateShare(newShare);
    }
  };

  const handleDeleteShare = (id: string) => {
    setShares(prev => prev.filter(share => share.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compartilhamento Público</h2>
          <p className="text-gray-600">Gerencie links públicos para compartilhar resultados de assessments</p>
        </div>
        
        {assessmentResults && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Link Público
          </Button>
        )}
      </div>

      {/* Criar novo compartilhamento */}
      {isCreating && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Criar Novo Link Público</CardTitle>
            <CardDescription>
              Configure um link público para compartilhar os resultados do assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Compartilhamento</Label>
              <Input
                id="title"
                value={newShareConfig.title}
                onChange={(e) => setNewShareConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: QualityScore Assessment Q4 2024"
              />
            </div>

            <div>
              <Label htmlFor="customShareId">ID Personalizado (opcional)</Label>
              <Input
                id="customShareId"
                value={newShareConfig.customShareId}
                onChange={(e) => setNewShareConfig(prev => ({ ...prev, customShareId: e.target.value }))}
                placeholder="Ex: empresa-avaliacao-q4"
              />
              <p className="text-sm text-gray-500 mt-1">
                Se vazio, será gerado automaticamente
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasExpiration"
                checked={newShareConfig.hasExpiration}
                onCheckedChange={(checked) => setNewShareConfig(prev => ({ ...prev, hasExpiration: checked }))}
              />
              <Label htmlFor="hasExpiration">Link com expiração</Label>
            </div>

            {newShareConfig.hasExpiration && (
              <div>
                <Label htmlFor="expiresAt">Data de Expiração</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={newShareConfig.expiresAt}
                  onChange={(e) => setNewShareConfig(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <Button onClick={handleCreateShare} disabled={!newShareConfig.title}>
                Criar Link Público
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de compartilhamentos */}
      <div className="space-y-4">
        {shares.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum link público criado ainda</p>
              <p className="text-sm">Crie um link público para compartilhar os resultados do assessment</p>
            </CardContent>
          </Card>
        ) : (
          shares.map((share) => (
            <Card key={share.id} className={`${!share.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{share.title}</h3>
                      <Badge variant="outline">{share.company}</Badge>
                      {share.isActive ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Eye className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span>Criado em {new Date(share.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>{share.viewCount} visualizações</span>
                        {share.expiresAt && (
                          <>
                            <span>•</span>
                            <span>Expira em {new Date(share.expiresAt).toLocaleDateString('pt-BR')}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs bg-gray-100 p-2 rounded">
                        <span className="flex-1">{getPublicUrl(share.shareId)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(share.shareId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(share.shareId, share.title, share.company)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getPublicUrl(share.shareId), '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(share.id)}
                    >
                      {share.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteShare(share.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {shares.length > 0 && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Links públicos permitem que qualquer pessoa com a URL visualize os resultados do assessment.
            Use a opção "Inativo" para desabilitar temporariamente o acesso sem deletar o link.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}