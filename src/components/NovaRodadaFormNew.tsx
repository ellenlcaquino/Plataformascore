import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X, Plus, User, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useUsersDB } from '../hooks/useUsersDB';
import { MemberAutocomplete } from './MemberAutocomplete';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ParticipanteForm {
  name: string;
  email: string;
  role: string;
}

const EMPRESAS_DISPONIVEIS = [
  { id: 'company-001', name: 'TechCorp Brasil', sector: 'Tecnologia' },
  { id: 'company-002', name: 'InovaSoft', sector: 'Software' },
  { id: 'company-003', name: 'DataTech Solutions', sector: 'Análise de Dados' },
  { id: 'company-004', name: 'CloudFirst', sector: 'Cloud Computing' },
  { id: 'company-005', name: 'MobileDev Co', sector: 'Desenvolvimento Mobile' }
];

export function NovaRodadaForm({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Carregar membros existentes para autocomplete
  const { users, loading: loadingUsers } = useUsersDB();
  
  const [formData, setFormData] = useState({
    companyId: isManager ? '' : user?.companyId || '',
    companyName: isManager ? '' : user?.companyName || '',
    dueDate: '',
    criterioEncerramento: 'automatico',
    allowPartialResults: false
  });

  // Estado separado para o líder (sempre fixo, não editável)
  const liderInfo = {
    name: user?.name || '',
    email: user?.email || '',
    role: 'leader'
  };

  // Participantes adicionais (sem incluir o líder)
  const [participantes, setParticipantes] = useState<ParticipanteForm[]>([]);

  // Estado para controlar busca de autocomplete
  const [searchValues, setSearchValues] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<(string | null)[]>([]);

  const addParticipante = () => {
    setParticipantes([...participantes, { name: '', email: '', role: '' }]);
    setSearchValues([...searchValues, '']);
    setSelectedMembers([...selectedMembers, null]);
  };

  const removeParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index));
    setSearchValues(searchValues.filter((_, i) => i !== index));
    setSelectedMembers(selectedMembers.filter((_, i) => i !== index));
  };

  const updateParticipante = (index: number, field: keyof ParticipanteForm, value: string) => {
    const updated = [...participantes];
    updated[index][field] = value;
    setParticipantes(updated);
    
    // Se editar o campo nome, sincronizar com o campo de busca
    if (field === 'name') {
      const updatedSearch = [...searchValues];
      updatedSearch[index] = value;
      setSearchValues(updatedSearch);
    }
    
    // Se o usuário editar manualmente, remover seleção de membro existente
    const updatedSelected = [...selectedMembers];
    updatedSelected[index] = null;
    setSelectedMembers(updatedSelected);
  };

  const handleSelectMember = (index: number, member: any) => {
    console.log('✅ Membro selecionado:', member.name, member.email);
    
    const updated = [...participantes];
    updated[index] = {
      name: member.name,
      email: member.email,
      role: member.role
    };
    setParticipantes(updated);
    
    // Atualizar valor de busca
    const updatedSearch = [...searchValues];
    updatedSearch[index] = member.name;
    setSearchValues(updatedSearch);
    
    // Marcar como membro existente selecionado
    const updatedSelected = [...selectedMembers];
    updatedSelected[index] = member.id;
    setSelectedMembers(updatedSelected);
  };

  const handleSearchChange = (index: number, value: string) => {
    const updatedSearch = [...searchValues];
    updatedSearch[index] = value;
    setSearchValues(updatedSearch);
    
    // SEMPRE atualizar o campo nome em tempo real conforme digita
    const updated = [...participantes];
    updated[index].name = value;
    setParticipantes(updated);
    
    // Se limpar a busca, limpar também a seleção de membro existente
    if (!value) {
      const updatedSelected = [...selectedMembers];
      updatedSelected[index] = null;
      setSelectedMembers(updatedSelected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('📝 Iniciando criação de rodada...');

      // Validar companyId
      if (!formData.companyId) {
        toast.error('Selecione uma empresa');
        setIsSubmitting(false);
        return;
      }

      // Validar dueDate
      if (!formData.dueDate) {
        toast.error('Defina a data limite');
        setIsSubmitting(false);
        return;
      }

      // Validar participantes (sem contar o líder)
      const participantesValidos = participantes.filter(p => 
        p.name.trim() && p.email.trim() && p.role.trim()
      );

      // Validar emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const p of participantesValidos) {
        if (!emailRegex.test(p.email)) {
          toast.error(`Email inválido: ${p.email}`);
          setIsSubmitting(false);
          return;
        }
      }

      // IMPORTANTE: Não incluir o líder aqui pois o servidor já adiciona automaticamente
      // Enviar apenas os participantes adicionais
      const todosParticipantes = participantesValidos.map(p => ({
        name: p.name.trim(),
        email: p.email.trim().toLowerCase(),
        role: p.role.trim()
      }));

      const requestBody = {
        company_id: formData.companyId,
        due_date: formData.dueDate,
        criterio_encerramento: formData.criterioEncerramento,
        created_by: user?.id,
        participantes: todosParticipantes,
      };

      console.log('📝 Criando rodada com participantes:', requestBody);

      // Chamar API para criar rodada
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2b631963/rodadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📝 Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Erro do servidor:', error);
        throw new Error(error.error || 'Erro ao criar rodada');
      }

      const result = await response.json();
      console.log('✅ Rodada criada com sucesso:', result);

      toast.success('Rodada criada com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('❌ Error creating rodada:', error);
      toast.error(error.message || 'Erro ao criar rodada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    const company = EMPRESAS_DISPONIVEIS.find(c => c.id === companyId);
    setFormData(prev => ({ 
      ...prev, 
      companyId: companyId,
      companyName: company?.name || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isManager ? 'Selecionar Empresa' : 'Empresa/Equipe'}
        </label>
        {isManager ? (
          <Select value={formData.companyId} onValueChange={handleCompanySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma empresa..." />
            </SelectTrigger>
            <SelectContent>
              {EMPRESAS_DISPONIVEIS.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.name} • {empresa.sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={formData.companyName}
            disabled
            className="bg-gray-50"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Limite
        </label>
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Critério de Encerramento
        </label>
        <Select 
          value={formData.criterioEncerramento}
          onValueChange={(value) => setFormData(prev => ({ ...prev, criterioEncerramento: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automatico">Automático (quando todos responderem)</SelectItem>
            <SelectItem value="manual">Manual (quando eu decidir)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Permitir resultados parciais
        </label>
        <Switch 
          checked={formData.allowPartialResults}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowPartialResults: checked }))}
        />
      </div>

      {/* Lista de Participantes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Participantes
          </label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addParticipante}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          {/* Líder (fixo, não editável) */}
          <Card className="p-4 border-green-200 bg-green-50/30">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                  <User className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-xs font-medium text-gray-600">
                    Líder da Empresa
                  </label>
                </div>
                
                {/* Nome do Líder */}
                <div className="px-3 py-2 bg-white border border-green-200 rounded-md text-sm">
                  {liderInfo.name}
                </div>
                
                {/* Email do Líder */}
                <div className="px-3 py-2 bg-white border border-green-200 rounded-md text-sm text-gray-600">
                  {liderInfo.email}
                </div>
                
                {/* Role do Líder */}
                <div className="px-3 py-2 bg-white border border-green-200 rounded-md text-sm text-gray-600">
                  leader
                </div>

                {/* Badge de Membro Existente */}
                <Badge variant="outline" className="gap-1 bg-green-100 text-green-800 border-green-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Membro existente selecionado
                </Badge>
              </div>
            </div>
          </Card>

          {/* Participantes adicionais */}
          {participantes.map((participante, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    selectedMembers[index] ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <User className={`h-4 w-4 ${
                      selectedMembers[index] ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {/* Autocomplete para buscar membro */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="h-3 w-3 text-gray-400" />
                      <label className="text-xs font-medium text-gray-600">
                        Buscar membro existente ou adicionar novo
                      </label>
                    </div>
                    <MemberAutocomplete
                      companyId={formData.companyId}
                      members={users}
                      value={searchValues[index]}
                      onSelect={(member) => handleSelectMember(index, member)}
                      onChange={(value) => handleSearchChange(index, value)}
                      placeholder="Digite o nome completo (ex: Ellen Silva)..."
                      disabled={!formData.companyId || loadingUsers}
                    />
                  </div>

                  {/* Campos de dados */}
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome completo *"
                      value={participante.name}
                      onChange={(e) => updateParticipante(index, 'name', e.target.value)}
                      required
                      className={selectedMembers[index] ? 'border-green-300 bg-green-50/50' : ''}
                    />
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={participante.email}
                      onChange={(e) => updateParticipante(index, 'email', e.target.value)}
                      required
                      className={selectedMembers[index] ? 'border-green-300 bg-green-50/50' : ''}
                    />
                    <Input
                      placeholder="Função/Cargo *"
                      value={participante.role}
                      onChange={(e) => updateParticipante(index, 'role', e.target.value)}
                      required
                      className={selectedMembers[index] ? 'border-green-300 bg-green-50/50' : ''}
                    />
                  </div>

                  {/* Indicador de status */}
                  {selectedMembers[index] ? (
                    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Membro existente selecionado
                    </Badge>
                  ) : participante.name && participante.email && participante.role ? (
                    <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-300">
                      <AlertCircle className="h-3 w-3" />
                      Novo membro será criado
                    </Badge>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeParticipante(index)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Dica:</strong> Use o campo de busca para encontrar membros já cadastrados na empresa. 
              Se não encontrar, preencha os dados manualmente e o sistema criará automaticamente o novo membro em "Cadastros".
            </span>
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Rodada'}
        </Button>
      </div>
    </form>
  );
}
