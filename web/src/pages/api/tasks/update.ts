import type { NextApiRequest, NextApiResponse } from "next";
import { updateTask } from "@/modules/taskManager";

type ResponseData = {
  success: boolean;
  message: string;
};

const sendResponse = (res: NextApiResponse<ResponseData>, status: number, success: boolean, message: string) => {
  res.status(status).json({ success, message });
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'PUT') {
    return sendResponse(res, 405, false, "Method not allowed");
  }

  const { id, ...updatedTask } = req.body;

  if (!id) {
    return sendResponse(res, 400, false, "Missing task ID");
  }

  try {
    updateTask(id, { ...updatedTask, group: parseInt(updatedTask.group) });
    console.log("Task updated successfully");
    return sendResponse(res, 200, true, "Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    return sendResponse(res, 500, false, "Error updating task");
  }
}