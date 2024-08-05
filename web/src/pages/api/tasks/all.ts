import type { NextApiRequest, NextApiResponse } from "next";
import { getAllTasks } from "@/modules/taskManager";

const handleGetRequest = (res: NextApiResponse) => {
  const allTasks = getAllTasks();
  res.status(200).json({ success: true, data: allTasks });
};

const handleInvalidMethod = (res: NextApiResponse) => {
  res.status(405).json({ success: false, message: "Method not allowed" });
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    handleGetRequest(res);
  } else {
    handleInvalidMethod(res);
  }
}
