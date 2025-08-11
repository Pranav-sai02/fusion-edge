import { CaseCaller } from './CaseCaller';

export interface CaseDetails {
  CaseDetailId: number;
  CaseStatus: string;
  CaseNumber: string;
  CaseReferenceNumber: string;
  ClientId: number;
  ServiceId: number;
  HappyClient: boolean;
  HappyService: boolean;
  CaseCreatedDate: string; // or Date if you prefer to convert
  CaseOpenedDate: string;
  CaseCompletedDate: string | null;
  ClosingComment: string;
  CreatedByUserId: string;
  CreatedDate: string;
  NeverCreateClaim: boolean;
  CaseCaller: CaseCaller; // define CaseCaller interface separately
  DeceasedName?: string; // optional field
  Type: string;
  FuneralDate: string | null; // or Date if you prefer to convert
}
