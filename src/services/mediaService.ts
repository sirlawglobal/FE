import { apiClient } from '../lib/apiClient';

export interface UploadResponse {
  url: string;
  publicId: string;
  duration?: number;
  format: string;
}

class MediaService {
  /**
   * Uploads a video file to Cloudinary via the backend Buffer-Pipe engine.
   * Restricted to Instructors and Admins.
   */
  async uploadVideo(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<UploadResponse>('/media/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // We can optionally add onUploadProgress here if we want a progress bar later
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  /**
   * Uploads an assignment file to Cloudinary.
   * Available for Students, Instructors, and Admins.
   */
  async uploadAssignment(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<UploadResponse>('/media/upload/assignment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading assignment:', error);
      throw error;
    }
  }
}

export const mediaService = new MediaService();
export default mediaService;
