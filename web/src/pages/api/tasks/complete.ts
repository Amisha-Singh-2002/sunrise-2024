import type { NextApiRequest, NextApiResponse } from "next";
import { completeTask } from "@/modules/taskManager";

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title } = req.body;
  console.log(title);

  if (title) {
    await completeTask(title);
    res.status(200).json({ success: true, message: "Task completed successfully" });
  } else {
    res.status(400).json({ success: false, message: "Missing required fields" });
  }
};

const handleInvalidMethod = (res: NextApiResponse) => {
  res.status(405).json({ success: false, message: "Method not allowed" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await handlePostRequest(req, res);
  } else {
    handleInvalidMethod(res);
  }
}
