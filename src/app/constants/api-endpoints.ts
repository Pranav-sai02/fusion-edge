import { environment } from '../../environments/environments';

export const API_ENDPOINTS = {
  SIDE_BAR_SERVICE: `${environment.apiBaseUrl}/Get/MenuConfigurations`,
  AREA_CODES: `${environment.apiBaseUrl}/Config/AreaCodes`,
  USERS: `${environment.apiBaseUrl}/Users`,
  LOGIN_USER_LIST: `${environment.apiBaseUrl}/Get/LoginInit`,
  CONFIG_SERVICE_PROVIDER_TYPES: `${environment.apiBaseUrl}/Config/ServiceProviderTypes`,
  SERVICES_PAGE: `${environment.apiBaseUrl}/Service`,
  SERVICE_PROVIDERS: `${environment.apiBaseUrl}/ServiceProvider`,
  CLIENT_GROUP: `${environment.apiBaseUrl}/ClientGroup`,
  CLIENT: `${environment.apiBaseUrl}/Client`,
  CASE_DEATILS: `${environment.apiBaseUrl}/CaseDetails`,
  CALLER_DETAILS: `${environment.apiBaseUrl}/CaseCaller`,
  CONFIG_RATING_QUESTIONS: `${environment.apiBaseUrl}/Config/RatingQuestion`,
  CONFIG_RATING_QUESTIONS_TYPES: `${environment.apiBaseUrl}/Config/RatingQuestionType`,
  CONFIG_RATING_QUESTIONS_OPTIONS: `${environment.apiBaseUrl}/Config/RatingQuestionOption`,
  CONFIG_VEHICLE: `${environment.apiBaseUrl}/Config/Vehicle`,
  CONFIG_BODY_LOCATIONS: `${environment.apiBaseUrl}/Config/BodyLocation`,
  CONFIG_DRIVERS: `${environment.apiBaseUrl}/Config/Driver`,
  CONFIG_DOCUMENTS: `${environment.apiBaseUrl}/Config/Document`,
  CONFIG_CLAIM_CENTRES: `${environment.apiBaseUrl}/Config/ClaimCentre`,
  CONFIG_BRANCHES: `${environment.apiBaseUrl}/Config/Branch`,
};
