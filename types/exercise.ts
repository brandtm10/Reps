export interface MuscleSubCategory {
  name: string;
  id: string;
}

export interface MuscleCategory {
  name: string;
  id: string;
  subCategories?: MuscleSubCategory[];
}

export interface Equipment {
  name: string;
  id: string;
}

