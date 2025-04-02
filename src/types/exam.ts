export interface Exam {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  updatedAt: string;
  categories: {
    name: string;
    path: string;
  }[];
}