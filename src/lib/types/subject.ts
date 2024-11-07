export interface Subject {
  id: number;
  subjectName: string;
}

export interface ActiveSubject extends Subject {
  tutorCount: number;
}
