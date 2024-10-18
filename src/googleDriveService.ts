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

  private async getDriveClient() {
    const auth = await this.authorize();
    return google.drive({
			version: 'v3',
			auth,
		});
  }

	public async uploadFile(filePath: string) {
		const fileName = path.basename(filePath);
    const drive = await this.getDriveClient();

		const fileMetadata = {
			name: fileName,
			parents: [google_drive_parent_id!],
		};

		const media = {
			mimeType: 'application/octet-stream',
			body: fs.createReadStream(filePath),
		};

		return await drive.files.create({
			requestBody: fileMetadata,
			media,
			fields: 'id',
		});
	}

  public async generateDownloadLink(fileId: string) {
    const drive = await this.getDriveClient();

    await drive.permissions.create({
			fileId: fileId!,
			requestBody: {
				role: 'reader',
				type: 'anyone',
			},
		});

    return await drive.files.get({
			fileId: fileId!,
			fields: 'webViewLink, webContentLink',
		});
  }
}
