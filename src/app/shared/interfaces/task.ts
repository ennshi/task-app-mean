export interface Task {
  _id?: string;
  description?: string;
  completed?: boolean;
  priority?: number;
  owner?: string;
  updatedAt?: string;
}

export interface TaskNum {
  noncompleted: number;
  urgent: number;
}
