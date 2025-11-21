import { CreateReportRequest, UpdateReportRequest } from '../domains/report-domain';
import { Report, ReportType } from '../models/report';

export const createReport = async (payload: CreateReportRequest & { reporter: string }) => {
  const newReport = new Report(payload);
  await newReport.save();
  return newReport;
};

export const getReportById = async (id: string) => {
  const report = await Report.findById(id).populate('reporter');
  return report;
};

export const getReportByIdWithProgresses = async (
  id: string
): Promise<(ReportType & { _id: string }) | null> => {
  const report = await Report.findById(id)
    .populate('reporter')
    .populate({
      path: 'progresses',
      options: { sort: { createdAt: -1 } },
    })
    .lean()
    .exec();
  return report as unknown as (ReportType & { _id: string }) | null;
};

export const getAllReports = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Report.find().sort({ createdAt: -1 }).populate('reporter').skip(skip).limit(limit).exec(),
    Report.countDocuments(),
  ]);

  return { items, total };
};

export const getReportsByReporter = async (reporter: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Report.find({ reporter })
      .sort({ createdAt: -1 })
      .populate('reporter')
      .skip(skip)
      .limit(limit)
      .exec(),
    Report.countDocuments({ reporter }),
  ]);

  return { items, total };
};

export const updateReportById = async (id: string, payload: Partial<UpdateReportRequest>) => {
  const updated = await Report.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const deleteReportById = async (id: string) => {
  const deleted = await Report.findByIdAndDelete(id);
  return deleted;
};

export const toggleReportStatusById = async (
  id: string,
  status: 'pending' | 'in-progress' | 'done'
) => {
  const updated = await Report.findByIdAndUpdate(id, { status }, { new: true });
  return updated;
};
