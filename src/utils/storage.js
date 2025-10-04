import { supabase } from './supabaseClient'

/**
 * Uploads a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} filePath - The path where the file should be stored
 * @returns {Promise<{data: any, error: any}>}
 */
export async function uploadFile(file, bucketName, filePath) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file)

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { data: null, error }
  }
}

/**
 * Downloads a file from Supabase Storage
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} filePath - The path of the file to download
 * @returns {Promise<{data: any, error: any}>}
 */
export async function downloadFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(filePath)

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error downloading file:', error)
    return { data: null, error }
  }
}

/**
 * Gets the public URL of a file in Supabase Storage
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} filePath - The path of the file
 * @returns {string} The public URL of the file
 */
export function getPublicUrl(bucketName, filePath) {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Lists all files in a Supabase Storage bucket
 * @param {string} bucketName - The name of the storage bucket
 * @returns {Promise<{data: any, error: any}>}
 */
export async function listFiles(bucketName) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error listing files:', error)
    return { data: null, error }
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param {string} bucketName - The name of the storage bucket
 * @param {string} filePath - The path of the file to delete
 * @returns {Promise<{data: any, error: any}>}
 */
export async function deleteFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { data: null, error }
  }
}