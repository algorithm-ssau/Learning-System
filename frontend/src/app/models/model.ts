export interface Student {
    login: string;
    name: string;
    surname: string;
    patronymic: string;
    class_name: string;
    password: string;
  }

export interface Journal {
  mark: number;
  student_login: string;
  id_task: number;
}

export interface StudentTask {
  task_name: string;
  task_mark: number;
  id_task: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}