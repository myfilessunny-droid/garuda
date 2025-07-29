import React, { useState } from 'react';
import { X, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinMovementModal: React.FC<JoinMovementModalProps> = ({ isOpen, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<'participant' | 'volunteer' | null>(null);

  const handleOptionSelect = (option: 'participant' | 'volunteer') => {
    setSelectedOption(option);
    if (option === 'volunteer') {
      window.location.href = '/volunteer';
    } else if (option === 'participant') {
      window.location.href = '/participant';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Join the Movement
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Choose how you'd like to contribute to our mission
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4">
            {/* Volunteer Option */}
            <button
              onClick={() => handleOptionSelect('volunteer')}
              className="group p-6 border-2 border-sandalwood rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">Volunteer</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your skills and time to support our programs and initiatives
                  </p>
                </div>
              </div>
            </button>

            {/* Participant Option */}
            <button
              onClick={() => handleOptionSelect('participant')}
              className="group p-6 border-2 border-sandalwood rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">Participant</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our programs and events to learn and grow with our community
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default JoinMovementModal; 