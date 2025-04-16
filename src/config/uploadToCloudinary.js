import axios from 'axios';
import { cloudinaryConfig } from './cloudinaryConfig';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'moment_upload'); // Replace with your Cloudinary upload preset
  formData.append('api_key', cloudinaryConfig.apiKey);

  try {
    // Using axios to send the POST request to Cloudinary's API
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      formData
    );

    // Return the secure URL from the Cloudinary response
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
