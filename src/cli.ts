import * as fs from 'fs';
import { intro, outro, text, spinner, select, note } from '@clack/prompts';
import GoogleDriveService from './googleDriveService';
import prompts from 'prompts';

export default class Cli {
  private googleDriveService: GoogleDriveService;

  constructor() {
    this.googleDriveService = new GoogleDriveService();
  }

  private async askPassword() {
    const response = await prompts({
      type: 'invisible',
      name: 'passcode',
      message: 'Enter your passcode to get download link',
      mask: '*',
    });
    return response.passcode;
  }

  private async getFilePath() {
    const filePath = await text({
      message: 'Please enter the file path:',
      validate: (value) => {
        if (!value) return 'File path cannot be empty';
        if (!fs.existsSync(value)) return 'File does not exist';
      },
    });
    return filePath;
  }

  private async handleFileUpload() {
    const s = spinner();
    const filePath = await this.getFilePath();
    s.start('Uploading file to Google Drive...');

    try {
      const file = await this.googleDriveService.uploadFile(filePath as string);
      const downloadResponse =
        await this.googleDriveService.generateDownloadLink(
          file.data.id as string
        );
      const downloadLink = downloadResponse.data.webContentLink;
      s.stop(`File successfully uploaded!`);
      s.stop(`Download link: ${downloadLink}`);
    } catch (error) {
      s.stop('File upload failed');
      console.error('Error uploading file:', error);
    }
  }

  private async handleFileDownload() {
    const enteredPasscode = await this.askPassword();
    note(`${enteredPasscode as string}`, 'Passcode');
  }

  public async run() {
    intro('Choose an option:');

    const action = (await select({
      message: 'What would you like to do?',
      options: [
        { value: 'upload', label: 'Upload a file' },
        { value: 'download', label: 'Download a file' },
      ],
    })) as 'upload' | 'download';

    const actionMap = {
      upload: this.handleFileUpload.bind(this),
      download: this.handleFileDownload.bind(this),
    };

    await actionMap[action]?.();
    outro(`🫡`);
  }
}
