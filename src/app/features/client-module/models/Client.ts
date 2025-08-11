export interface Client {
  ClientId: number;
  ClientGroupId: number;
  ClientGroup: ClientGroup;
  ClientName: string;
  ClaimsManager: string | null;
  Address: string | null;
  ClaimFormDeclaration: string | null;
  ClaimFormDeclarationPlain: string | null;
  Code: string;
  CompanyLogo: string | null;
  CompanyLogoData: string | null;
  DoTextExport: boolean;
  Fax: string | null;
  Mobile: string;
  IsActive: boolean;
  NearestClaimCentre: boolean;
  OtherValidationNotes: string | null;
  PolicyFile: string;
  PolicyLabel: string;
  PolicyLookup: boolean;
  PolicyLookupFileData: string | null;
  PolicyLookupFileName: string | null;
  PolicyLookupPath: string | null;
  PrintName: string;
  ProcessClaims: boolean;
  Tel: string;
  UseMembershipNumber: boolean;
  Validate: boolean;
  ValidationExternalFile: boolean;
  ValidationLabel1: string | null;
  ValidationLabel2: string | null;
  ValidationLabel3: string | null;
  ValidationLabel4: string | null;
  ValidationLabel5: string | null;
  ValidationLabel6: string | null;
  ValidationOther: boolean;
  ValidationWeb: boolean;
  WebURL: string;
  WebValidationAVS: boolean;
  WebValidationOTH: boolean;
  WebValidationURL: string;
  EnableVoucherExportOnDeathClaim: boolean;
  IsDeleted?: boolean;

  ClientServiceProvider: ClientServiceProvider[];
  ClientService: ClientService[];
  ClientRatingQuestion: ClientRatingQuestion[];
  clientDocument: ClientDocument[];
  ClientClaimController: ClientClaimController[];
  ClientClaimCentre: ClientClaimCentre[];
}

export interface ClientGroup {
  ClientGroupId: number;
  Name: string;
  IsActive: boolean;
}

export interface ClientServiceProviderDto {
  ServiceProviderId: number;
  Name: string;
}

export interface ClientServiceProvider {
  ClientServiceProviderId: number;
  ClientId: number;
  ServiceProviderId: number;
  ClientServiceProviderDto?: ClientServiceProviderDto;
}

export interface ServiceDto {
  ServiceId: number;
  Description: string;
}

export interface ClientService {
  ClientServiceId: number;
  ClientId: number;
  ServiceId: number;
  Note: string;
  TransferNumber: string;
  ServiceDto?: ServiceDto;
}

export interface RatingQuestionType {
  RatingQuestionTypeId: number;
  QuestionType: string;
}

export interface RatingQuestion {
  RatingQuestionId: number;
  RatingQuestionTypeId: number;
  RatingQuestionType?: RatingQuestionType;
  Question: string;
  IsActive: boolean;
  ListRank: number;
}

export interface ClientRatingQuestion {
  ClientRatingQuestionId: number;
  ClientId: number;
  RatingQuestionId: number;
  ListRank: number;
  IsDeleted: boolean;
  RatingQuestion?: RatingQuestion;
}

export interface DocumentDto {
  DocumentId: number;
  Description: string;
  IsDelete: boolean;
  IsActive: boolean;
}

export interface ClientDocument {
  ClientDocumentId: number;
  DocumentId: number;
  ClientId: number;
  Note: string;
  FileData: string;
  FileName: string;
  ListRank: number;
  IsDeleted: boolean;
  Document?: DocumentDto;
}

export interface AspNetUser {
  AspNetUserId: number;
  UserName: string;
  UserEmail: string;
  Firstname: string;
  Lastname: string;
  IsActive: boolean;
  IsDeleted?: boolean;
}

export interface ClientClaimController {
  ClientClaimControllerId: number;
  ClientId: number;
  UserId: number;
  IsDeleted?: boolean;
  User?: AspNetUser;
}

export interface ClaimCentreDto {
  ClaimCentreId: number;
  Name: string;
}

export interface ClientClaimCentre {
  ClientClaimCentreId: number;
  ClientId: number;
  ClaimCentreId: number;
  ClaimCentre?: ClaimCentreDto;
}
