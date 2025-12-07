export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: number;
  positionName: string; 
}

export interface EmployeeResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  employeeNumber: number;
  email: string;
  position: string;
  productName: string;
  employeeSkills: EmployeeSkill[];
  teamEmployees: TeamEmployee[];
  employeeProducts: EmployeeProduct[];
}
export interface EmployeeSkill {
  id: number;
  skillName: string;
}
export interface TeamEmployee {
  id: number;
  teamName: string;
}
export interface Team {
  id: number;
  name: string;
  description?: string;
}


export interface Skill {
  id: number;
  name: string;
  description?: string;
  categoryId?: number;
}

export interface EmployeeProduct {
  id: number;
  productId: number;
  employeeId: number;
  product?: Product;   // optional nested product object
  productName: string; // flat property
}

export interface Product {
  id: number;
  productName: string;
  description?: string;
}
