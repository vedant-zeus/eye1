export interface TrainingData {
  images: string[];
  labels: number[];
}

const DISEASE_LABELS = {
  'Bulging_Eyes': 0,
  'Cataracts': 1,
  'Crossed_Eyes': 2,
  'Glaucoma': 3,
  'Uveitis': 4
};

export async function loadTrainingData(): Promise<TrainingData> {
  const images: string[] = [];
  const labels: number[] = [];

  try {
    // Load images from the public directory
    const response = await fetch('/api/training-data');
    const data = await response.json();

    // Process each image and its label
    data.forEach((item: { path: string; label: string }) => {
      images.push(item.path);
      labels.push(DISEASE_LABELS[item.label as keyof typeof DISEASE_LABELS]);
    });

    return { images, labels };
  } catch (error) {
    console.error('Error loading training data:', error);
    throw error;
  }
} 