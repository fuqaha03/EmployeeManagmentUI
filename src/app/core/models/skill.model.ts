export interface Skill {
  id: number;
  name: string;
  isAssigned: boolean;
  category: string;  
  categoryId: number;  
    description: string;
  isActive: boolean;
  createdOn: Date;
stack?: string;
    lastUsed?: string; // yyyy-MM-dd
  yearsOfExperience?: number;
  selfRating?: number; // 1 to 5
  notes : string
}

export interface SkillDto {
  id?: number;
  categoryId: number;
  name: string;
  description: string;
  isActive: boolean;
  createdOn: Date;
  stack?: string;
} 
export interface CategorySkillDto {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
  createdOn: Date;
  stackId: number;  
} 