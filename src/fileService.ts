import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export default class FileService {
  private serverUrl: string;

  constructor() {
    this.serverUrl = 'http://localhost:3000';
  }

  async upload(filePath: string) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.post(`${this.serverUrl}/upload`, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async download(fileId: string, destinationDir: string) {
    const serverUrl = `${this.serverUrl}/download/${fileId}`;

    try {
      if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }

      const response = await axios({
        method: 'get',
        url: serverUrl,
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
}
