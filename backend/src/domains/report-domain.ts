import { z } from 'zod';
import {
  createReportProgressValidator,
  createReportValidator,
  updateReportValidator,
} from '../validators/report-validator';
import { ProgressType } from 'models/progress';

export type CreateReportRequest = z.infer<typeof createReportValidator>;
export type UpdateReportRequest = z.infer<typeof updateReportValidator>;

export type ReportResponse = {
  id: string;
  reporter: {
    id: string;
    name: string;
  };
  progresses: {
    id: string;
    description: string;
    photos: string[];
    createdAt: Date;
  }[];
  title: string;
  location: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'done';
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ReportCreateResponse = {
  id: string;
  title: string;
};

export type ListReportsResponse = Omit<ReportResponse, 'progresses'>[];

export type CreateReportProgressRequest = z.infer<typeof createReportProgressValidator>;
