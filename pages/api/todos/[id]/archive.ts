// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { todos, Todo } from '../../todos'

const TODO_SERVICE_URI = process.env.TODO_SERVICE_URI

const headers = {
  'Content-Type': 'application/json',
}

type ErrorResponse = {
  message: string
}

type Response = ErrorResponse | any

async function archive(id: string): Promise<Todo> {
  return fetch(`${TODO_SERVICE_URI}/todos/${id}/archive`, {
    headers,
  }).then(res => res.json())
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const {
    method,
    query: { id },
  } = req

  switch (method) {
    case 'PUT':
    case 'GET': {
      const data = await archive(id as string)
      console.log('ARCHIVED TODO:', data)
      return res.status(200).json(data)
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
