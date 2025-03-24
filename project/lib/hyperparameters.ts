import { ActivationIdentifier } from '@tensorflow/tfjs-layers/dist/keras_format/activation_config';

export interface Hyperparameters {
  // Model architecture
  convLayers: {
    filters: number[];
    kernelSize: number;
    activation: ActivationIdentifier;
  };
  denseUnits: number;
  dropoutRate: number;

  // Training parameters
  learningRate: number;
  batchSize: number;
  epochs: number;
  validationSplit: number;
}

export const defaultHyperparameters: Hyperparameters = {
  convLayers: {
    filters: [32, 64, 128],
    kernelSize: 3,
    activation: 'relu' as ActivationIdentifier
  },
  denseUnits: 512,
  dropoutRate: 0.5,
  learningRate: 0.001,
  batchSize: 32,
  epochs: 10,
  validationSplit: 0.2
};

export const hyperparameterRanges = {
  convLayers: {
    filters: {
      min: 16,
      max: 256,
      step: 16
    },
    kernelSize: {
      options: [2, 3, 5]
    },
    activation: {
      options: ['relu', 'elu', 'selu', 'tanh'] as ActivationIdentifier[]
    }
  },
  denseUnits: {
    min: 128,
    max: 1024,
    step: 64
  },
  dropoutRate: {
    min: 0.1,
    max: 0.7,
    step: 0.1
  },
  learningRate: {
    min: 0.0001,
    max: 0.01,
    step: 0.0001
  },
  batchSize: {
    options: [16, 32, 64, 128]
  },
  epochs: {
    min: 5,
    max: 50,
    step: 5
  }
}; 