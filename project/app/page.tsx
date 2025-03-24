'use client';

import Link from 'next/link';
import { Eye, Upload, Activity, Users, ArrowRight, Sparkles, CheckCircle2, Camera, Brain, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const contactRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const contactInView = useInView(contactRef, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              AI-Powered Eye Disease Detection
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Early detection & treatment for accessible & affordable eye care
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/scan">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  <Upload className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Start Detection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground">Advanced technology for accurate eye disease detection</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning algorithms for precise disease detection"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure & Private",
                description: "Your data is encrypted and handled with the highest security standards"
              },
              {
                icon: <Camera className="h-8 w-8" />,
                title: "Easy Image Upload",
                description: "Simple interface for uploading eye scan images or taking photos"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple steps to get your eye scan analyzed</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={howItWorksInView ? "animate" : "initial"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "1",
                title: "Upload Image",
                description: "Upload your eye scan image or take a photo using your camera"
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI model analyzes the image for potential eye conditions"
              },
              {
                step: "3",
                title: "Get Results",
                description: "Receive detailed analysis and recommendations"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative p-6 bg-card rounded-xl"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 mt-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg text-muted-foreground">Get in touch with our team</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={contactInView ? "animate" : "initial"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Mail className="h-6 w-6" />,
                title: "Email",
                content: "contact@eyedetection.com"
              },
              {
                icon: <Phone className="h-6 w-6" />,
                title: "Phone",
                content: "+1 (555) 123-4567"
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Location",
                content: "123 Medical Center, Healthcare City"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-background rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary mb-4">{contact.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                <p className="text-muted-foreground">{contact.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2024 Eye Disease Detection. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}