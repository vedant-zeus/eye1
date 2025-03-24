import * as tf from '@tensorflow/tfjs';
import { Hyperparameters, defaultHyperparameters } from './hyperparameters';

export interface PredictionResult {
  disease: string;
  confidence: number;
}

// Model class for eye disease detection
export class EyeDiseaseModel {
  public model: tf.LayersModel | null = null;
  private labels: string[] = [
    'Bulging_Eyes',
    'Cataracts',
    'Crossed_Eyes',
    'Glaucoma',
    'Uveitis'
  ];

  async loadModel(hyperparameters: Hyperparameters = defaultHyperparameters) {
    try {
      // Create a CNN model with hyperparameters
      this.model = tf.sequential({
        layers: [
          // First convolutional block
          tf.layers.conv2d({
            inputShape: [224, 224, 3],
            kernelSize: hyperparameters.convLayers.kernelSize,
            filters: hyperparameters.convLayers.filters[0],
            activation: hyperparameters.convLayers.activation,
            padding: 'same'
          }),
          tf.layers.maxPooling2d({ poolSize: 2 }),
          tf.layers.dropout({ rate: hyperparameters.dropoutRate }),

          // Second convolutional block
          tf.layers.conv2d({
            kernelSize: hyperparameters.convLayers.kernelSize,
            filters: hyperparameters.convLayers.filters[1],
            activation: hyperparameters.convLayers.activation,
            padding: 'same'
          }),
          tf.layers.maxPooling2d({ poolSize: 2 }),
          tf.layers.dropout({ rate: hyperparameters.dropoutRate }),

          // Third convolutional block
          tf.layers.conv2d({
            kernelSize: hyperparameters.convLayers.kernelSize,
            filters: hyperparameters.convLayers.filters[2],
            activation: hyperparameters.convLayers.activation,
            padding: 'same'
          }),
          tf.layers.maxPooling2d({ poolSize: 2 }),
          tf.layers.dropout({ rate: hyperparameters.dropoutRate }),

          // Flatten and dense layers
          tf.layers.flatten(),
          tf.layers.dense({ units: hyperparameters.denseUnits, activation: 'relu' }),
          tf.layers.dropout({ rate: hyperparameters.dropoutRate }),
          tf.layers.dense({
            units: this.labels.length,
            activation: 'softmax'
          })
        ]
      });

      // Compile the model with hyperparameters
      this.model.compile({
        optimizer: tf.train.adam(hyperparameters.learningRate),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      console.log('Model created successfully with hyperparameters:', hyperparameters);
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  }

  async preprocessImage(imageData: string): Promise<tf.Tensor4D> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Convert image to tensor and preprocess
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Resize to model input size
            .toFloat()
            .expandDims();
          
          // Normalize pixel values
          const normalized = tensor.div(255.0);
          resolve(normalized as tf.Tensor4D);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = (error) => reject(error);
      img.src = imageData;
    });
  }

  async predict(imageData: string): Promise<PredictionResult[]> {
    try {
      if (!this.model) {
        await this.loadModel();
      }

      // Preprocess the image
      const tensor = await this.preprocessImage(imageData);

      // Make prediction
      const predictions = await this.model!.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();

      // Cleanup tensors
      tensor.dispose();
      predictions.dispose();

      // Format results
      return Array.from(probabilities)
        .map((confidence, index) => ({
          disease: this.labels[index],
          confidence: parseFloat(confidence.toFixed(4))
        }))
        .sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  async trainModel(trainingData: { images: string[], labels: number[] }, hyperparameters: Hyperparameters = defaultHyperparameters) {
    try {
      if (!this.model) {
        await this.loadModel(hyperparameters);
      }

      // Preprocess all training images
      const processedImages = await Promise.all(
        trainingData.images.map(img => this.preprocessImage(img))
      );

      // Create tensors for training
      const xs = tf.concat(processedImages, 0);
      const ys = tf.oneHot(trainingData.labels, this.labels.length);

      // Train the model with hyperparameters
      await this.model!.fit(xs, ys, {
        epochs: hyperparameters.epochs,
        batchSize: hyperparameters.batchSize,
        validationSplit: hyperparameters.validationSplit,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}/${hyperparameters.epochs}`);
            console.log(`Loss: ${logs?.loss.toFixed(4)}, Accuracy: ${logs?.acc.toFixed(4)}`);
          }
        }
      });

      // Cleanup
      xs.dispose();
      ys.dispose();
      processedImages.forEach(tensor => tensor.dispose());

      console.log('Training completed with hyperparameters:', hyperparameters);
    } catch (error) {
      console.error('Training error:', error);
      throw error;
    }
  }
}

export const eyeDiseaseModel = new EyeDiseaseModel();