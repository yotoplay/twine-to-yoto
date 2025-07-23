export interface AuthCredentials {
  refresh_token?: string;
  client_id?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval: number;
}
