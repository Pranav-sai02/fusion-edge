export interface TransportOperator {
  TransportOperatorId?: number;
  Name: string;
  Branch: string;
  Province: string;
  Country: string;
  IsActive: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}
