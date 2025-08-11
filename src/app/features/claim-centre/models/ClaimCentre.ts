import { ClientGroup } from '../../client-module/models/ClientGroup';

export interface ClaimCentre {
  ClaimCentreId: number;
  Name: string;
  ClientGroupId: number;
  ClientGroup?: ClientGroup; // Define this interface separately
  Province: string;
  Branch: string;
  TownCity: string;
  Address: string;
  Fax: string;
  Tel: string;
  IsActive: boolean;
  IsDeleted?: boolean;
}
