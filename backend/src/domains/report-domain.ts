import { z } from 'zod';
import { createReportValidator, updateReportValidator } from '../validators/report-validator';

export type CreateReportRequest = z.infer<typeof createReportValidator>;
export type UpdateReportRequest = z.infer<typeof updateReportValidator>;

export type ReportResponse = {
  id: string;
  reporter: {
    id: string;
    name: string;
  };
  title: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'done';
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ListReportsResponse = ReportResponse[];
