import apiClient from '../lib/apiClient';

export interface TeamMember {
  id: string;
  fullName: string;
  profilePicture: string | null;
  track: string;
  createdAt: string;
}

export const teamService = {
  async getAll(): Promise<TeamMember[]> {
    const response = await apiClient.get<TeamMember[]>('/team-members');
    return response.data;
  },

  async create(data: { fullName: string; track: string; profilePicture?: File }): Promise<TeamMember> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('track', data.track);
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    const response = await apiClient.post<TeamMember>('/team-members', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
