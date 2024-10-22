import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export default class FileService {
  private serverUrl: string;

  constructor() {
    this.serverUrl = 'https://fs-server-0caw.onrender.com';
  }

  async upload(filePath: string, hashedPassCode: string, sharedKey: string) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const additionalData = {
        hashedPassCode,
        sharedKey,
      };

      const response = await axios.post(`${this.serverUrl}/upload`, form, {
        headers: {
          ...form.getHeaders(),
          'Content-Type': 'multipart/form-data',
          'x-additional-data': JSON.stringify(additionalData),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getSecuredFile(sharedKey: string) {
    try {
      const response = await axios.get(`${this.serverUrl}/file/${sharedKey}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  async download(fileId: string, destinationDir: string, sharedKey: string) {
    try {
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      const response = await axios({
        method: 'get',
        url: `${this.serverUrl}/download/${fileId}?sharedKey=${encodeURIComponent(sharedKey)}`,
        responseType: 'stream',
      });

      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `downloaded_file_${fileId}`;

      const filePath = path.join(destinationDir, fileName);
      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      const response = await axios.delete(
        `${this.serverUrl}/delete/${fileId}`
      );
      return response.status;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }
}
