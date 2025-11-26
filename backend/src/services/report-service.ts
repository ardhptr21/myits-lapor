import {
  CreateReportProgressRequest,
  CreateReportRequest,
  ListReportsResponse,
  ReportCreateResponse,
  ReportResponse,
  UpdateReportRequest,
} from '../domains/report-domain';
import { HTTPException } from '../exceptions/http-exception';
import { HTTPResponse } from '../libs/http';
import { removeFiles } from '../libs/storage';
import { UserType } from '../models/user';
import { createProgress } from '../repositories/progress-repository';
import {
  createReport,
  deleteReportById,
  getAllReports,
  getReportById,
  getReportByIdWithProgresses,
  getReportsByReporter,
  toggleReportStatusById,
  updateReportById,
} from '../repositories/report-repository';

export const createReportService = async (
  body: CreateReportRequest,
  reporterId: string
): Promise<HTTPResponse<ReportCreateResponse>> => {
  const res = new HTTPResponse<ReportCreateResponse>();

  body = { ...body, photos: body.photos.map((p) => `uploads/reports/${p}`) };
  const created = await createReport({ ...body, reporter: reporterId });
  if (!created) throw new HTTPException(500, 'Failed to create report');

  return res.withCode(201).withMessage('Report created').withData({
    id: created._id.toString(),
    title: created.title,
  });
};

export const listReportsService = async (
  page = 1,
  limit = 10
): Promise<HTTPResponse<ListReportsResponse>> => {
  const res = new HTTPResponse<ListReportsResponse>();

  const { items, total } = await getAllReports(page, limit);

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

export const listReportsByReporterService = async (
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

  const report = await getReportByIdWithProgresses(id);
  if (!report) throw new HTTPException(404, 'Report not found');
  const reporter = report.reporter as unknown as UserType & { _id: string };

  return res
    .withCode(200)
    .withMessage('Report fetched')
    .withData({
      id: report._id,
      reporter: {
        id: reporter._id,
        name: reporter.name,
      },
      progresses: report.progresses.map((p) => ({
        id: p._id,
        description: p.description,
        photos: p.photos,
        createdAt: p.createdAt,
      })),
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

export const deleteReportService = async (id: string): Promise<HTTPResponse<null>> => {
  const res = new HTTPResponse<null>();

  const report = (await getReportById(id)).toObject();
  if (!report) throw new HTTPException(404, 'Report not found');

  const ok = await deleteReportById(id);
  if (!ok) throw new HTTPException(500, 'Failed to delete report');
  removeFiles(report.photos);

  return res.withCode(200).withMessage('Report deleted');
};

export const toggleReportStatusService = async (id: string): Promise<HTTPResponse<unknown>> => {
  const res = new HTTPResponse<unknown>();

  const report = (await getReportById(id)).toObject();
  if (!report) throw new HTTPException(404, 'Report not found');

  if (report.status === 'done') throw new HTTPException(400, 'Report is already done');

  let nextStatus: 'pending' | 'in-progress' | 'done';
  switch (report.status) {
    case 'pending':
      nextStatus = 'in-progress';
      break;
    case 'in-progress':
      nextStatus = 'done';
      break;
  }

  const updated = await toggleReportStatusById(id, nextStatus);
  if (!updated) throw new HTTPException(500, 'Failed to update report status');

  return res.withCode(200).withMessage('Report status updated');
};

export const createReportProgressService = async (
  reportId: string,
  body: CreateReportProgressRequest
): Promise<HTTPResponse<unknown>> => {
  const res = new HTTPResponse<unknown>();
  const report = (await getReportById(reportId)).toObject();
  if (!report) throw new HTTPException(404, 'Report not found');

  if (report.status != 'in-progress')
    throw new HTTPException(400, 'Cannot add progress to report that is not in-progress');

  await createProgress(reportId, {
    ...body,
    photos: body.photos ? body.photos.map((p) => `uploads/progresses/${p}`) : [],
  });

  return res.withCode(201).withMessage('New report progress success');
};
