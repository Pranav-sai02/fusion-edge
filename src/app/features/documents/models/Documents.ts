export interface Documents {
  DocumentId: number;
  Description: string;
  IsActive: boolean;
  IsDelete?: boolean;
  IsEdited?: boolean; // For UI tracking
  FileName?:string;
  ListRank?:number;
  FileUrl?:string;
}
