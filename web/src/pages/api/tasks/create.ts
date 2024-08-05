import type { NextApiRequest, NextApiResponse } from "next";
import { createTask } from "@/modules/taskManager";

type ResponseData = {
  success: boolean;
  message: string;
};

const sendResponse = (res: NextApiResponse<ResponseData>, status: number, success: boolean, message: string) => {
  res.status(status).json({ success, message });
};

const isValidTaskData = (data: any): data is { title: string; description: string; persona: string; group: string } => {
  return Boolean(data.title && data.description && data.persona && data.group);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return sendResponse(res, 405, false, "Method not allowed");
  }

  if (!isValidTaskData(req.body)) {
    return sendResponse(res, 400, false, "Missing required fields");
  }

  const { title, description, persona, group } = req.body;

  try {
    createTask(title, description, persona, Number(group));
    return sendResponse(res, 201, true, "Task created successfully");
  } catch (error) {
    console.error("Error creating task:", error);
    return sendResponse(res, 500, false, "Error creating task");
  }
}