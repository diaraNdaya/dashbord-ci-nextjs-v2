export interface PushNotification {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface CreatePushNotificationCredential {
  title: string;
  body: string;
  imageUrl?: string;
}

export interface PushNotificationApiResponse {
  status: number;
  data: Data;
}

export interface Data {
  id: string;
  external_id: any;
}
