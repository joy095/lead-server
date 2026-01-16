import { Request, Response } from "express";
import Lead from "../models/Lead";
import { sendEmail } from "../utils/nodemailer";
import logger from "../utils/logger";

export const getLeads = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      stage = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    logger.info("Fetching leads", {
      userId: (req as any).user?.id,
      page,
      limit,
      search,
      stage,
      sortBy,
      sortOrder,
    });

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
        { company: { $regex: search as string, $options: "i" } },
      ];
    }
    if (stage && stage !== "all") {
      query.stage = stage;
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "asc" ? 1 : -1;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    logger.info(`Successfully fetched ${leads.length} leads`, {
      userId: (req as any).user?.id,
      total,
      page,
      limit,
    });

    res.json({
      success: true,
      leads,
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching leads", {
      error: error.message,
      stack: error.stack,
      userId: (req as any).user?.id,
      query: req.query,
    });

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const leadId = req.params.id;
    logger.info("Fetching lead by ID", {
      leadId,
      userId: (req as any).user?.id,
    });

    const lead = await Lead.findById(leadId);
    if (!lead) {
      logger.warn("Lead not found", { leadId, userId: (req as any).user?.id });
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    logger.info("Successfully fetched lead", {
      leadId,
      userId: (req as any).user?.id,
    });
    return res.json({ success: true, lead });
  } catch (error: any) {
    logger.error("Error fetching lead by ID", {
      error: error.message,
      stack: error.stack,
      leadId: req.params.id,
      userId: (req as any).user?.id,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    logger.info("Creating new lead", {
      leadData: req.body,
      userId: (req as any).user?.id,
    });

    const lead = new Lead(req.body);
    const savedLead = await lead.save();

    // Send notification email
    const emailSent = await sendEmail(
      savedLead.email,
      "New Lead Created",
      `<p>Hello ${savedLead.name},</p><p>Your lead has been created successfully.</p>`
    );

    logger.info("Lead created successfully", {
      leadId: savedLead._id,
      userId: (req as any).user?.id,
      emailSent,
    });

    res.status(201).json({ success: true, savedLead });
  } catch (error: any) {
    logger.error("Error creating lead", {
      error: error.message,
      stack: error.stack,
      leadData: req.body,
      userId: (req as any).user?.id,
    });

    res.status(400).json({
      success: false,
      message: error.message || "Bad request",
    });
  }
};

export const updateLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const leadId = req.params.id;
    logger.info("Updating lead", {
      leadId,
      updateData: req.body,
      userId: (req as any).user?.id,
    });

    const lead = await Lead.findByIdAndUpdate(leadId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      logger.warn("Lead not found for update", {
        leadId,
        userId: (req as any).user?.id,
      });
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    logger.info("Lead updated successfully", {
      leadId,
      userId: (req as any).user?.id,
    });

    return res.json({ success: true, lead });
  } catch (error: any) {
    logger.error("Error updating lead", {
      error: error.message,
      stack: error.stack,
      leadId: req.params.id,
      updateData: req.body,
      userId: (req as any).user?.id,
    });

    return res.status(400).json({
      success: false,
      message: error.message || "Bad request",
    });
  }
};

export const deleteLead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const leadId = req.params.id;
    logger.info("Deleting lead", { leadId, userId: (req as any).user?.id });

    const lead = await Lead.findByIdAndDelete(leadId);
    if (!lead) {
      logger.warn("Lead not found for deletion", {
        leadId,
        userId: (req as any).user?.id,
      });
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    logger.info("Lead deleted successfully", {
      leadId,
      userId: (req as any).user?.id,
    });

    return res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error: any) {
    logger.error("Error deleting lead", {
      error: error.message,
      stack: error.stack,
      leadId: req.params.id,
      userId: (req as any).user?.id,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching analytics data", {
      userId: (req as any).user?.id,
    });

    const [totalLeads, convertedLeads, lostLeads] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ stage: "converted" }),
      Lead.countDocuments({ stage: "lost" }),
    ]);

    const avgDealValueResult = await Lead.aggregate([
      { $match: { value: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgValue: { $avg: "$value" } } },
    ]);

    const avgDealValue = avgDealValueResult[0]?.avgValue || 0;

    logger.info("Analytics data fetched successfully", {
      totalLeads,
      convertedLeads,
      lostLeads,
      avgDealValue,
      userId: (req as any).user?.id,
    });

    return res.json({
      success: true,
      data: {
        totalLeads,
        convertedLeads,
        lostLeads,
        avgDealValue,
      },
    });
  } catch (error: any) {
    logger.error("Error fetching analytics", {
      error: error.message,
      stack: error.stack,
      userId: (req as any).user?.id,
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
