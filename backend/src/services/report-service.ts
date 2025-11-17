import {
  CreateReportRequest,
  ListReportsResponse,
  ReportResponse,
  UpdateReportRequest,
} from '../domains/report-domain';
import { HTTPException } from '../exceptions/http-exception';
import { HTTPResponse } from '../libs/http';
import { removeFiles } from '../libs/storage';
import { UserType } from '../models/user';
import {
  createReport,
  deleteReportById,
  getReportById,
  getReportsByReporter,
  updateReportById,
} from '../repositories/report-repository';

export const createReportService = async (
  body: CreateReportRequest,
  reporterId: string
): Promise<HTTPResponse<ReportResponse>> => {
  const res = new HTTPResponse<ReportResponse>();

  body = { ...body, photos: body.photos.map((p) => `uploads/reports/${p}`) };
  const created = await createReport({ ...body, reporter: reporterId });
  if (!created) throw new HTTPException(500, 'Failed to create report');

  return res
    .withCode(201)
    .withMessage('Report created')
    .withData({
      id: created._id.toString(),
      reporter: {
        id: created.reporter._id.toString(),
        name: (created.reporter as any).name,
      },
      title: created.title,
      location: created.location,
      priority: created.priority,
      status: created.status,
      photos: created.photos,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
};

export const listReportsService = async (
  reporterId: string,
  page = 1,
  limit = 10
): Promise<HTTPResponse<ListReportsResponse>> => {
  const res = new HTTPResponse<ListReportsResponse>();

  const { items, total } = await getReportsByReporter(reporterId, page, limit);

  const data = items.map((r) => ({
    id: r._id.toString(),
    reporter: {
      id: r.reporter._id.toString(),
      name: (r.reporter as any).name,
    },
    title: r.title,
    location: r.location,
    priority: r.priority,
    status: r.status,
    photos: r.photos,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  return res
    .withCode(200)
    .withMessage('Reports fetched')
    .withData(data)
    .withMeta({ page, limit, total });
};

export const getReportService = async (
  id: string,
  reporterId: string
): Promise<HTTPResponse<ReportResponse>> => {
  const res = new HTTPResponse<ReportResponse>();

  const report = (await getReportById(id)).toObject();
  if (!report) throw new HTTPException(404, 'Report not found');
  const reporter = report.reporter as unknown as UserType & { _id: string };

  if (reporter._id.toString() !== reporterId) throw new HTTPException(403, 'Access denied');

  return res
    .withCode(200)
    .withMessage('Report fetched')
    .withData({
      id: report._id.toString(),
      reporter: {
        id: reporter._id.toString(),
        name: reporter.name,
      },
      title: report.title,
      location: report.location,
      priority: report.priority,
      status: report.status,
      photos: report.photos,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    });
};

export const updateReportService = async (
  id: string,
  body: UpdateReportRequest,
  reporterId: string
): Promise<HTTPResponse<unknown>> => {
  const res = new HTTPResponse<unknown>();

  const report = await getReportById(id);
  if (!report) throw new HTTPException(404, 'Report not found');
  if (report.reporter.toString() !== reporterId) throw new HTTPException(403, 'Access denied');

  const updated = await updateReportById(id, body);
  if (!updated) throw new HTTPException(500, 'Failed to update report');

  return res.withCode(200).withMessage('Report updated');
};

export const deleteReportService = async (
  id: string,
  reporterId: string
): Promise<HTTPResponse<null>> => {
  const res = new HTTPResponse<null>();

  const report = (await getReportById(id)).toObject();
  if (!report) throw new HTTPException(404, 'Report not found');
  if (report.reporter._id.toString() !== reporterId) throw new HTTPException(403, 'Access denied');

  const ok = await deleteReportById(id);
  if (!ok) throw new HTTPException(500, 'Failed to delete report');
  removeFiles(report.photos);

  return res.withCode(200).withMessage('Report deleted');
};
