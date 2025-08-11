export interface AreaCodes {
  originalAreaCode?: string;
  AreaCodeId?: number;
  AreaCode: string;
  Description: string;
  Type: 'Landline' | 'Mobile' | 'International';
  IsActive: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}
