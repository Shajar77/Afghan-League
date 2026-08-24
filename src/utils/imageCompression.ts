import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  initialQuality?: number
}

/**
 * Compresses an image File in the browser before sending to backend database.
 * Reduces 10MB+ camera uploads to lightweight ~200-500KB WebP/JPEG files.
 * If compression fails or file is non-image (e.g. PDF), returns original file safely.
 */
export async function compressImageFile(
  file: File,
  customOptions?: CompressionOptions
): Promise<File> {
  if (!file || !file.type.startsWith('image/')) {
    return file
  }

  // Skip tiny images (< 150 KB)
  if (file.size < 150 * 1024) {
    return file
  }

  const options: CompressionOptions = {
    maxSizeMB: 0.5,          // Target max 500 KB payload
    maxWidthOrHeight: 1600,  // Max dimension 1600px
    useWebWorker: true,
    initialQuality: 0.85,
    ...customOptions
  }

  try {
    const compressed = await imageCompression(file, options)
    return compressed
  } catch {
    // Compression failed — return original file unchanged
    return file
  }
}
