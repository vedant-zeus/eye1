import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import * as path from 'path';
import { EyeDiseaseModel } from '../lib/eye-disease-model';

const DATASET_PATH = 'c:/Users/VEDANT/OneDrive/Desktop/archive (2)/Eye_diseases';
const BATCH_SIZE = 32;
const EPOCHS = 50;
const VALIDATION_SPLIT = 0.2;

async function loadDataset() {
  const categories = ['Bulging_Eyes', 'Cataracts', 'Crossed_Eyes', 'Glaucoma', 'Uveitis'];
  const images: tf.Tensor4D[] = [];
  const labels: number[] = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categoryPath = path.join(DATASET_PATH, category);
    const files = fs.readdirSync(categoryPath);

    console.log(`Loading ${category} images...`);

    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const imagePath = path.join(categoryPath, file);
        const imageBuffer = fs.readFileSync(imagePath);
        const image = await tf.node.decodeImage(imageBuffer);
        const resized = tf.image.resizeBilinear(image as tf.Tensor3D, [224, 224]);
        const normalized = resized.div(255.0);
        const expanded = normalized.expandDims(0);

        images.push(expanded as tf.Tensor4D);
        labels.push(i);

        // Cleanup tensors
        image.dispose();
        resized.dispose();
        normalized.dispose();
      }
    }
  }

  // Concatenate all images and create labels tensor
  const xs = tf.concat(images, 0);
  const ys = tf.oneHot(labels, categories.length);

  return { xs, ys };
}

async function trainModel() {
  try {
    console.log('Loading dataset...');
    const { xs, ys } = await loadDataset();

    console.log('Creating model...');
    const model = new EyeDiseaseModel();
    await model.loadModel();

    console.log('Training model...');
    const history = await model.model!.fit(xs, ys, {
      batchSize: BATCH_SIZE,
      epochs: EPOCHS,
      validationSplit: VALIDATION_SPLIT,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1} of ${EPOCHS}`);
          console.log(`Loss: ${logs?.loss.toFixed(4)}, Accuracy: ${logs?.acc.toFixed(4)}`);
        }
      }
    });

    console.log('Training completed!');
    console.log('Final accuracy:', history.history.acc[history.history.acc.length - 1]);

    // Save the model
    await model.model!.save('file://./trained_model');
    console.log('Model saved successfully!');

    // Cleanup
    xs.dispose();
    ys.dispose();
  } catch (error) {
    console.error('Training error:', error);
  }
}

trainModel(); 