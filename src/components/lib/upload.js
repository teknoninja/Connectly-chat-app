import { supabase } from './supabase';

const upload = async (file) => {
  if (!file) {
    return null;
  }

  try {
    // Create a unique file path
    const filePath = `public/${Date.now()}_${file.name}`;

    // Upload the file to the 'avatars' bucket
    const {  error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new Error('File upload failed.');
  }
};

export default upload;
