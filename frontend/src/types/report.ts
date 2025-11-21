import type { APIResponse } from './api';

export type Reporter = {
  id: string;
  name: string;
};

export type Report = {
  id: string;
  reporter: Reporter;
  title: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  photos: string[];
  createdAt: string;
  updatedAt: string;
};

export type ReportCreateResponse = APIResponse<Report>;
