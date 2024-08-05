import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTask } from "@/modules/taskManager";

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
  if (req.method !== 'DELETE') {
    return sendResponse(res, 405, false, "Method not allowed");
  }

  const { id } = req.query;

  if (!id) {
    return sendResponse(res, 400, false, "Missing task ID");
  }

  try {
    deleteTask(Number(id));
    return sendResponse(res, 200, true, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    return sendResponse(res, 500, false, "Error deleting task");
  }
}