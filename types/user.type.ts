import type { Village } from "./village.type";

export enum UserType {
  TEACHER = 0,
  OBSERVATOR = 1,
  MEDIATOR = 2,
  ADMIN = 3,
  SUPER_ADMIN = 4,
}

export interface User {
  id: number;
  email: string;
  teacherName: string;
  pseudo: string;
  school: string;
  level: string;
  type: UserType;

  // village relation
  villageId: number | null;
  village: Village | null;

  // country relation
  countryCode: string;
}
