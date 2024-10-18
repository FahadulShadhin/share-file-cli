import * as fs from 'fs';
import {
	google_client_email,
	google_drive_parent_id,
	google_private_key,
	SCOPES,
} from './variables';
import { google } from 'googleapis';
import path from 'path';

export default class GoogleDriveService {

	private async authorize() {
		const jwtClient = new google.auth.JWT({
			email: google_client_email,
			key: google_private_key,
			scopes: SCOPES,
		});
		await jwtClient.authorize();
		return jwtClient;
	}

	public async uploadFile(filePath: string) {
		const fileName = path.basename(filePath);
		const auth = await this.authorize();

		const drive = google.drive({
			version: 'v3',
			auth,
		});

		const fileMetadata = {
			name: fileName,
			parents: [google_drive_parent_id!],
		};

		const media = {
			mimeType: 'application/octet-stream',
			body: fs.createReadStream(filePath),
		};

		const file = await drive.files.create({
			requestBody: fileMetadata,
			media,
			fields: 'id',
		});

		return file.data.id;
	}
}
