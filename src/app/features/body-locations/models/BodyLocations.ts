export interface BodyLocations {
  BodyLocationId: number;
  BodyLocationCode: string;
  Description: string;
  IsActive: boolean;
  IsDelete: boolean | null;
  IsEdited?:boolean;
}
