export interface Version {
  id: string;
  minVersion: string;
  latestVersion: string;
  forceUpdateMessage: string;
}

export interface CreateVersionPayload {
  latestVersion: string;
  minVersion: string;
  forceUpdateMessage: string;
}

export interface VersionResponse {
  success: boolean;
  message?: string;
  data: Version[];
}

export interface VersionSingleResponse {
  success: boolean;
  message?: string;
  data: Version;
}
