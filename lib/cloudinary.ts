import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000, // 2 minutes timeout
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
}

/**
 * Uploads a file buffer to Cloudinary using standard upload_stream
 * @param buffer File buffer to upload
 * @param folder Cloudinary folder name
 * @param filename Original filename to derive the public ID from
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'preengineered_building',
  filename?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    // Determine public ID without extension
    let publicId: string | undefined;
    if (filename) {
      const baseName = filename.split('.').slice(0, -1).join('.');
      // Sanitize public id: replace non-alphanumeric/hyphen/underscore with underscore
      publicId = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload succeeded but returned no result object.'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an asset from Cloudinary
 * @param publicId The public_id of the asset in Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

/**
 * Extracts Cloudinary public ID from a URL
 * @param url Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;

    // parts[1] is e.g. "v1700000000/folder/subfolder/file.jpg" or "folder/subfolder/file.jpg"
    let path = parts[1];

    // Remove version prefix if exists (e.g. v1700000000/)
    const versionMatch = path.match(/^v\d+\/(.+)$/);
    if (versionMatch) {
      path = versionMatch[1];
    }

    // Remove file extension
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex !== -1) {
      path = path.substring(0, dotIndex);
    }

    return path;
  } catch (err) {
    console.error('Error parsing Cloudinary URL:', err);
    return null;
  }
}
