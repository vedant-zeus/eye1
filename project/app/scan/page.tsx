'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { eyeDiseaseModel, type PredictionResult } from '@/lib/eye-disease-model';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await eyeDiseaseModel.loadModel();
        setModelLoaded(true);
      } catch (error) {
        console.error('Failed to load model:', error);
        setError('Failed to load the AI model. Please refresh the page.');
      }
    };
    loadModel();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setPredictions([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check your camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setSelectedImage(canvas.toDataURL('image/jpeg'));
      setPredictions([]);
      setError(null);
      stopCamera();
      setIsCameraOpen(false);
    }
  };

  const analyzeScan = async () => {
    if (!selectedImage || !modelLoaded) return;

    setIsAnalyzing(true);
    setPredictions([]);
    setError(null);

    try {
      const results = await eyeDiseaseModel.predict(selectedImage);
      setPredictions(results);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          Eye Scan Analysis
        </motion.h1>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4">Upload Scan</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors duration-300">
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground transition-transform hover:scale-110" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-4">Take Photo</h2>
              <Dialog open={isCameraOpen} onOpenChange={(open) => {
                setIsCameraOpen(open);
                if (!open) stopCamera();
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full h-48 group"
                    variant="outline"
                    onClick={() => {
                      setIsCameraOpen(true);
                      startCamera();
                    }}
                  >
                    <Camera className="w-8 h-8 mr-2 transition-transform group-hover:scale-110" />
                    Open Camera
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Take Photo</DialogTitle>
                  </DialogHeader>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <Button
                      onClick={capturePhoto}
                      className="mt-4 w-full group"
                    >
                      <ImageIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                      Capture Photo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Analysis</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedImage(null);
                      setPredictions([]);
                      setError(null);
                    }}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <img
                      src={selectedImage}
                      alt="Uploaded scan"
                      className="w-full rounded-lg transition-transform group-hover:scale-[1.02]"
                    />
                    <Button 
                      className="mt-4 w-full group"
                      onClick={analyzeScan}
                      disabled={isAnalyzing || !modelLoaded}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Scan'
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Results</h3>
                    {predictions.length > 0 ? (
                      <div className="space-y-3">
                        {predictions.map((prediction, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between text-sm">
                              <span>{prediction.disease}</span>
                              <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={prediction.confidence * 100} className="h-2" />
                          </motion.div>
                        ))}
                      </div>
                    ) : isAnalyzing ? (
                      <div className="text-center text-muted-foreground">
                        Analyzing image...
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Click "Analyze Scan" to detect eye conditions
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}