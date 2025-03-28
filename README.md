# AI-Based Eye Disease Detection System

A modern web application that uses artificial intelligence to detect various eye conditions from retinal images. Built with Next.js, TensorFlow.js, and a beautiful UI using shadcn/ui components.

## Features

- 🖼️ **Image Upload**: Upload retinal images for analysis
- 📸 **Camera Integration**: Take photos directly using your device's camera
- 🔍 **AI Analysis**: Real-time detection of eye conditions
- 📊 **Results Visualization**: Clear presentation of detection results with confidence scores
- 🎨 **Modern UI**: Beautiful and responsive interface built with Next.js and shadcn/ui
- 🌙 **Dark Mode Support**: Seamless dark/light theme switching

## Detected Conditions

The system can detect the following eye conditions:

- Normal
- Diabetic Retinopathy
- Glaucoma
- Cataract
- Age-related Macular Degeneration

## Tech Stack

- **Frontend Framework**: Next.js 13.5.1
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **AI/ML**: TensorFlow.js
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd trained_model-eye-detection
   ```

2. Install dependencies:

   ```bash
   cd project
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
   (Note: If port 3000 is in use, the server will automatically use port 3001)

## Usage

1. **Home Page**:

   - Click the "Upload Scans" button to access the scanning interface

2. **Scan Page**:
   - Choose between uploading an image or taking a photo
   - For image upload: Click the upload area or drag and drop an image
   - For camera: Click "Open Camera" and use your device's camera
   - Click "Analyze Scan" to process the image
   - View the results with confidence scores for each condition

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── scan/              # Scan page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and models
│   └── eye-disease-model.ts  # AI model implementation
└── public/               # Static assets
```

## Development

- The application uses Next.js 13 with the App Router
- Components are built using shadcn/ui for a consistent design system
- TensorFlow.js is used for the AI model implementation
- TypeScript ensures type safety throughout the application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [TensorFlow.js](https://www.tensorflow.org/js)
