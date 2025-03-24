'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { eyeDiseaseModel } from '@/lib/eye-disease-model';
import { loadTrainingData } from '@/lib/training-data';
import { HyperparameterTuning } from '@/components/hyperparameter-tuning';
import { Hyperparameters, defaultHyperparameters } from '@/lib/hyperparameters';
import { Loader2 } from 'lucide-react';

export default function TrainPage() {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [currentHyperparameters, setCurrentHyperparameters] = useState<Hyperparameters>(defaultHyperparameters);

  const handleHyperparametersChange = (hyperparameters: Hyperparameters) => {
    setCurrentHyperparameters(hyperparameters);
  };

  const handleTrain = async () => {
    try {
      setIsTraining(true);
      setProgress('Loading training data...');

      // Load training data
      const trainingData = await loadTrainingData();
      setProgress(`Loaded ${trainingData.images.length} images for training`);

      setProgress('Training model...');
      await eyeDiseaseModel.trainModel(trainingData, currentHyperparameters);
      setProgress('Training completed successfully!');
    } catch (error) {
      console.error('Training error:', error);
      setProgress('Error during training. Please try again.');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Train Eye Disease Detection Model</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Hyperparameter Tuning</h2>
          <HyperparameterTuning onHyperparametersChange={handleHyperparametersChange} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Training Controls</h2>
          <p className="text-gray-600 mb-4">
            Configure the model architecture and training parameters using the controls on the left,
            then click the button below to start training.
          </p>

          <Button
            onClick={handleTrain}
            disabled={isTraining}
            className="w-full"
          >
            {isTraining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training in progress...
              </>
            ) : (
              'Start Training'
            )}
          </Button>

          {progress && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-700">{progress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 