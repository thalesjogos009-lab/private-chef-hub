import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface BookingFlowProps {
  chefId: string;
  onBack: () => void;
  onComplete: () => void;
}

type BookingStep = 'datetime' | 'details' | 'confirmation';

export function BookingFlow({ chefId, onBack, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('datetime');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    address: '',
    guests: '',
    observations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTimes = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const handleDateTimeNext = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('details');
    }
  };

  const handleDetailsNext = () => {
    if (formData.address && formData.guests) {
      setCurrentStep('confirmation');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    onComplete();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {['datetime', 'details', 'confirmation'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step 
                ? 'bg-primary text-primary-foreground' 
                : index < ['datetime', 'details', 'confirmation'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            {index < 2 && (
              <div className={`w-12 h-0.5 mx-2 ${
                index < ['datetime', 'details', 'confirmation'].indexOf(currentStep)
                  ? 'bg-green-500'
                  : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-lg font-semibold ml-4">Agendar Chef</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {renderStepIndicator()}

        {currentStep === 'datetime' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Selecione Data e Horário
              </h2>
              <p className="text-muted-foreground">
                Escolha quando você gostaria que o chef atenda
              </p>
            </div>

            {/* Calendar */}
            <div className="bg-card rounded-lg p-4 shadow-card">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="w-full"
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Horário disponível</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="h-10"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full"
              onClick={handleDateTimeNext}
              disabled={!selectedDate || !selectedTime}
            >
              Continuar
            </Button>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Detalhes do Evento
              </h2>
              <p className="text-muted-foreground">
                Informe os dados do seu evento gastronômico
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Endereço completo *
                </Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="guests" className="text-sm font-medium">
                  Número de convidados *
                </Label>
                <Input
                  id="guests"
                  placeholder="Ex: 8 pessoas"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="observations" className="text-sm font-medium">
                  Observações
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Preferências, restrições alimentares..."
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={handleDetailsNext}
              disabled={!formData.address || !formData.guests}
            >
              Continuar
            </Button>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Confirmar Agendamento
              </h2>
              <p className="text-muted-foreground">
                Revise os dados do seu agendamento
              </p>
            </div>

            <div className="bg-card rounded-lg p-4 shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Data e Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate?.toLocaleDateString('pt-BR')} às {selectedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">{formData.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Convidados</p>
                  <p className="text-sm text-muted-foreground">{formData.guests}</p>
                </div>
              </div>

              {formData.observations && (
                <div className="pt-2 border-t">
                  <p className="font-medium mb-1">Observações</p>
                  <p className="text-sm text-muted-foreground">{formData.observations}</p>
                </div>
              )}
            </div>

            <Button 
              className="w-full bg-gradient-accent hover:shadow-accent"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando Solicitação...
                </div>
              ) : (
                'Enviar Solicitação'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}