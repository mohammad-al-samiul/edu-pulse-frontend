export interface ICategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategoryResponse {
  success: boolean;
  data: ICategory[];
  message?: string;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
}
