import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const datasetPath = 'c:/Users/VEDANT/OneDrive/Desktop/archive (2)/Eye_diseases';
    const categories = ['Bulging_Eyes', 'Cataracts', 'Crossed_Eyes', 'Glaucoma', 'Uveitis'];
    const trainingData = [];

    for (const category of categories) {
      const categoryPath = path.join(datasetPath, category);
      const files = fs.readdirSync(categoryPath);

      for (const file of files) {
        if (file.endsWith('.jpg') || file.endsWith('.png')) {
          trainingData.push({
            path: `/dataset/${category}/${file}`,
            label: category
          });
        }
      }
    }

    return NextResponse.json(trainingData);
  } catch (error) {
    console.error('Error loading training data:', error);
    return NextResponse.json({ error: 'Failed to load training data' }, { status: 500 });
  }
} 