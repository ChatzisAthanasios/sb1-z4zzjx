export async function uploadImage(file: File): Promise<string> {
  // In a real application, you would upload to a server/cloud storage
  // For demo purposes, we'll create an object URL
  return URL.createObjectURL(file);
}