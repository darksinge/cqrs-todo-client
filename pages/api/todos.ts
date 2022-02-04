// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Priority = "low" | "medium" | "high";

export type Todo = {
  id: number;
  text: string;
  priority: Priority;
  done?: boolean;
};

type GetTodoResponse = {
  todos: Todo[];
};

const todos: Todo[] = [
  {
    id: 0,
    text: "clean bedroom",
    priority: "low",
  },
  {
    id: 1,
    text: "grocery shopping",
    priority: "medium",
  },
  {
    id: 2,
    text: "learn Rust",
    priority: "high",
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetTodoResponse>
) {
  res.status(200).json({ todos });
}
