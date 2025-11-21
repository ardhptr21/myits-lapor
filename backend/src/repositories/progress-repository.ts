import { CreateReportProgressRequest } from '../domains/report-domain';
import { Progress } from '../models/progress';

export const createProgress = async (reportId: string, payload: CreateReportProgressRequest) => {
  const newProgress = new Progress({ report: reportId, ...payload });
  await newProgress.save();
  return newProgress;
};
