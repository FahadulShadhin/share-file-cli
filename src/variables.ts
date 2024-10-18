import * as dotenv from 'dotenv';

dotenv.config();

export const SCOPES = ['https://www.googleapis.com/auth/drive'];

export const google_type = process.env.GOOGLE_TYPE;
export const google_project_id = process.env.GOOGLE_PROJECT_ID;
export const google_private_key_id = process.env.GOOGLE_PRIVATE_KEY_ID;
export const google_private_key = process.env.GOOGLE_PRIVATE_KEY!.replace(
	/\\n/g,
	'\n'
);
export const google_client_email = process.env.GOOGLE_CLIENT_EMAIL;
export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_auth_uri = process.env.GOOGLE_AUTH_URI;
export const google_token_uri = process.env.GOOGLE_TOKEN_URI;
export const google_drive_parent_id = process.env.GOOGLE_DRIVE_PARENT_ID;
