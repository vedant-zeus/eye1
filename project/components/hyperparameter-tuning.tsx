'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Hyperparameters, defaultHyperparameters, hyperparameterRanges } from '@/lib/hyperparameters';

interface HyperparameterTuningProps {
  onHyperparametersChange: (hyperparameters: Hyperparameters) => void;
}

export function HyperparameterTuning({ onHyperparametersChange }: HyperparameterTuningProps) {
  const [hyperparameters, setHyperparameters] = useState<Hyperparameters>(defaultHyperparameters);

  const handleChange = (key: keyof Hyperparameters, value: any) => {
    const newHyperparameters = {
      ...hyperparameters,
      [key]: value
    };
    setHyperparameters(newHyperparameters);
    onHyperparametersChange(newHyperparameters);
  };

  const handleConvLayerChange = (key: keyof typeof hyperparameters.convLayers, value: any) => {
    const newHyperparameters = {
      ...hyperparameters,
      convLayers: {
        ...hyperparameters.convLayers,
        [key]: value
      }
    };
    setHyperparameters(newHyperparameters);
    onHyperparametersChange(newHyperparameters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Model Architecture</h3>
        <div className="space-y-4">
          <div>
            <Label>Convolutional Layer Filters</Label>
            <div className="flex gap-2">
              {hyperparameters.convLayers.filters.map((filter, index) => (
                <div key={index} className="flex-1">
                  <Slider
                    value={[filter]}
                    onValueChange={([value]) => {
                      const newFilters = [...hyperparameters.convLayers.filters];
                      newFilters[index] = value;
                      handleConvLayerChange('filters', newFilters);
                    }}
                    min={hyperparameterRanges.convLayers.filters.min}
                    max={hyperparameterRanges.convLayers.filters.max}
                    step={hyperparameterRanges.convLayers.filters.step}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Kernel Size</Label>
            <Select
              value={hyperparameters.convLayers.kernelSize.toString()}
              onValueChange={(value) => handleConvLayerChange('kernelSize', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hyperparameterRanges.convLayers.kernelSize.options.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}x{size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Activation Function</Label>
            <Select
              value={hyperparameters.convLayers.activation}
              onValueChange={(value) => handleConvLayerChange('activation', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hyperparameterRanges.convLayers.activation.options.map((activation) => (
                  <SelectItem key={activation} value={activation}>
                    {activation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dense Units</Label>
            <Slider
              value={[hyperparameters.denseUnits]}
              onValueChange={([value]) => handleChange('denseUnits', value)}
              min={hyperparameterRanges.denseUnits.min}
              max={hyperparameterRanges.denseUnits.max}
              step={hyperparameterRanges.denseUnits.step}
            />
          </div>

          <div>
            <Label>Dropout Rate</Label>
            <Slider
              value={[hyperparameters.dropoutRate]}
              onValueChange={([value]) => handleChange('dropoutRate', value)}
              min={hyperparameterRanges.dropoutRate.min}
              max={hyperparameterRanges.dropoutRate.max}
              step={hyperparameterRanges.dropoutRate.step}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Training Parameters</h3>
        <div className="space-y-4">
          <div>
            <Label>Learning Rate</Label>
            <Slider
              value={[hyperparameters.learningRate]}
              onValueChange={([value]) => handleChange('learningRate', value)}
              min={hyperparameterRanges.learningRate.min}
              max={hyperparameterRanges.learningRate.max}
              step={hyperparameterRanges.learningRate.step}
            />
          </div>

          <div>
            <Label>Batch Size</Label>
            <Select
              value={hyperparameters.batchSize.toString()}
              onValueChange={(value) => handleChange('batchSize', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hyperparameterRanges.batchSize.options.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Epochs</Label>
            <Slider
              value={[hyperparameters.epochs]}
              onValueChange={([value]) => handleChange('epochs', value)}
              min={hyperparameterRanges.epochs.min}
              max={hyperparameterRanges.epochs.max}
              step={hyperparameterRanges.epochs.step}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 