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