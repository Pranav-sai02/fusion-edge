export interface Vehicle {
  VehicleId: number,
  RegNumber: number;
  Description: string;
  Branch: string;
  Province: string;
  Country: string;
  IsActive: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}
