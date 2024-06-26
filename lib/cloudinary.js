import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (Image) => {
    const buffer = await Image.arrayBuffer();
    const bytes = Buffer.from(buffer);
  return new Promise(async(resolve, reject) => {
    cloudinary.uploader.upload_stream({
      resource_type: 'auto',
    folder: 'Instagram-clone-uploads',}, async(error, result) => {
      if (error) {
        return reject(error.message);
      } else {
        return resolve(result);
      }
    }).end(bytes)
  })
}
export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};
