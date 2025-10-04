import { useState } from 'react'
import { uploadFile, getPublicUrl } from '../utils/storage'

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      // Upload to a bucket named 'avatars' with a unique filename
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await uploadFile(file, 'avatars', fileName)

      if (error) {
        console.error('Upload error:', error)
        return
      }

      // Get the public URL of the uploaded file
      const publicUrl = getPublicUrl('avatars', fileName)
      setUploadedUrl(publicUrl)
      console.log('File uploaded successfully:', publicUrl)
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="file-upload">
      <h3>Upload Avatar</h3>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*" 
      />
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="card-button-primary"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      
      {uploadedUrl && (
        <div className="uploaded-preview">
          <h4>Uploaded Avatar:</h4>
          <img 
            src={uploadedUrl} 
            alt="Uploaded preview" 
            style={{ maxWidth: '200px', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  )
}