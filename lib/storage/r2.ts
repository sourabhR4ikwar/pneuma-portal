import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"

// Initialize the S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "pneuma-assets"

// Upload a file to R2
export async function uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: 'pneuma/assets/' + fileName,
        Body: file,
        ContentType: contentType,
      },
    })

    await upload.done()
    return fileName
  } catch (error) {
    console.error("Error uploading file to R2:", error)
    throw new Error("Failed to upload file to storage")
  }
}

// Get a signed URL for a file
export async function getFileUrl(fileName: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'pneuma/assets/' + fileName,
    })

    // URL expires in 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  } catch (error) {
    console.error("Error getting signed URL:", error)
    throw new Error("Failed to get file URL")
  }
}

// Delete a file from R2
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const command = {
      Bucket: BUCKET_NAME,
      Key: 'pneuma/assets/' + fileName,
    }

    await s3Client.send(command)
  } catch (error) {
    console.error("Error deleting file from R2:", error)
    throw new Error("Failed to delete file from storage")
  }
}
