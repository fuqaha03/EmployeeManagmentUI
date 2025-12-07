import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { EmployeesComponent } from './admin/employees/employees';
import { Createemployee } from './admin/employees/create/createemployee/createemployee';
import { SkillsManagementComponent } from './admin/skills/skills';
import { EmployeeProfileComponent } from './admin/employees/employee-profile/employee-profile';
import { SkillManagmentCRUD } from './admin/skills/skill-managment-crud/skill-managment-crud';
// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/adminGuard';
import { EmployeeGuard } from './core/guards/employeeGuard';
import { EmployeeDetails } from './admin/employees/employee-details/employee-details';
import { ProductsComponent } from './admin/products/products';
import { TeamsComponent } from './admin/teams/teams';
import { EmployeeTeamManagment } from './admin/employees/employee-team-managment/employee-team-managment';
import { UpdateTeamMember } from './admin/teams/update-team-memeber/update-team-memeber';
import { UpdateProductMember } from './admin/products/update-product-memeber/update-product-memeber';
import { EmployeesSkillsComponent } from './admin/employees/employees-skills/employees-skills';

export const routes: Routes = [

  // Public route
  { path: 'login', component: LoginComponent },

  // Admin routes
  { 
    path: 'admin/employees', 
    component: EmployeesComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/accounts/employee', 
    component: Createemployee,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/employees/employees/:id', 
    component: EmployeeDetails,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'admin/employees/employees-skills', 
    component: EmployeesSkillsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  {
  path: 'admin/positions',
  loadComponent: () =>
    import('../app/admin/positions/positions').then(m => m.PositionsComponent),
  canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'admin/products',
    component: ProductsComponent,
  canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'admin/skills',
      component: SkillManagmentCRUD,
    canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'admin/teams',
      component: TeamsComponent,
    canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'employee/teams',
      component: TeamsComponent,
    canActivate: [AuthGuard, EmployeeGuard]
},
  {
  path: 'teams/:teamId/members',
      component: UpdateTeamMember,
    canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'products/:productId/members',
      component: UpdateProductMember,
    canActivate: [AuthGuard, AdminGuard]
},
  {
  path: 'teams/:teamId/members',
      component: EmployeeTeamManagment,
    canActivate: [AuthGuard, AdminGuard]
},

  // Employee routes
  { 
    path: 'employee/profile', 
    component: EmployeeProfileComponent,
    canActivate: [AuthGuard, EmployeeGuard]
  },
  { 
    path: 'employee/skills-managment', 
    component: SkillsManagementComponent,
    canActivate: [AuthGuard]
  },
  // { 
  //   path: 'employee/employee-teams', 
  //   component: EmployeeTeamManagment,
  //   canActivate: [AuthGuard, EmployeeGuard]
  // },
  // { 
  //   path: `/admin/employees/:id`, 
  //   component: EmployeeDetails,
  //   canActivate: [AuthGuard,EmployeeGuard]
  // },

  // Default
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
