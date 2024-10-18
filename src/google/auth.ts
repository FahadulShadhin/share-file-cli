import { google } from "googleapis";
import { google_client_email, google_private_key, SCOPES } from "../variables";

export async function authorize() {
	const jwtClient = new google.auth.JWT({
		email: google_client_email,
		key: google_private_key,
		scopes: SCOPES,
	});
	await jwtClient.authorize();
	return jwtClient;
}
