import * as fs from 'fs';
import path from 'path';
import { authorize } from './auth';
import { google } from 'googleapis';
import { google_drive_parent_id } from '../variables';

export async function uploadFile(filePath: string) {
	const fileName = path.basename(filePath);
	const auth = await authorize();
	
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
