import * as fs from 'fs';
import {
  google_client_email,
  google_drive_parent_id,
  google_private_key,
  SCOPES,
} from './variables';
import { google, drive_v3 } from 'googleapis';
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

  private async getDriveInstance(): Promise<drive_v3.Drive> {
    const auth = await this.authorize();
    return google.drive({
      version: 'v3',
      auth,
    });
  }

  public async getFileMetadata(fileId: string): Promise<string | null | undefined> {
    const drive = await this.getDriveInstance();
    const response = await drive.files.get({
      fileId,
      fields: 'name',
    });
    return response.data.name;
  }

  public async uploadFile(filePath: string): Promise<drive_v3.Schema$File> {
    const fileName = path.basename(filePath);
    const drive = await this.getDriveInstance();

    if (!google_drive_parent_id) throw new Error('No parent folder was given!');

    const fileMetadata = {
      name: fileName,
      parents: [google_drive_parent_id],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: fs.createReadStream(filePath),
    };

    const response =  await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    return response.data;
  }

  public async generateDownloadLink(fileId: string): Promise<drive_v3.Schema$File> {
    const drive = await this.getDriveInstance();

    await drive.permissions.create({
      fileId: fileId!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const response =  await drive.files.get({
      fileId: fileId!,
      fields: 'webViewLink, webContentLink',
    });

    return response.data;
  }

  public async downloadFile(
    fileId: string,
    destinationPath: string
  ): Promise<void> {
    const drive = await this.getDriveInstance();
    const destination = fs.createWriteStream(destinationPath);

    const res = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise<void>((resolve, reject) => {
      res.data
        .on('end', () => resolve())
        .on('error', (err: any) => reject(err))
        .pipe(destination);
    });
  }
}
