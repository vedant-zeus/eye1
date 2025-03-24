import tensorflow as tf
import tensorflowjs as tfjs

# Load the trained model
model = tf.keras.models.load_model('eye_disease_model.h5')

# Convert the model to TensorFlow.js format
tfjs.converters.save_keras_model(model, '../public/models/eye_disease_model')

print("Model converted successfully!") 