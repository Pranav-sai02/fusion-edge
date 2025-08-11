export interface User {
  AspNetUserId?: number; // Backend primary key
  UserName: string;
  UserEmail: string;
  PhoneNumber?: string;
  MobileNumber?: string;
  EmployeeId?: string;
  Firstname: string;
  Lastname: string;
  PasswordHash?: string;
  SecurityStamp?: string;
  ProfileImage?: string; // Base64 string
  IsActive: boolean;
  IsAdmin: boolean;
  EmailConfirmed: boolean;
  IsDeleted?: boolean;
  Roles?: string[];
}
