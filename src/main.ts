import * as fs from 'fs';
import { intro, outro, text, spinner, select, note } from '@clack/prompts';
import { uploadFile } from './google/uploader';

async function getFilePath() {
	const filePath = await text({
		message: 'Please enter the file path:',
		validate: (value) => {
			if (!value) return 'File path cannot be empty';
			if (!fs.existsSync(value)) return 'File does not exist';
		},
	});

	return filePath;
}

async function handleFileUpload() {
  const filePath = await getFilePath();

	const s = spinner();
	s.start('Uploading file to Google Drive...');

	try {
		const fileID = await uploadFile(filePath as string);
		s.stop(`File successfully uploaded! -- ID: ${fileID}`);
	} catch (error) {
		s.stop('File upload failed');
		console.error('Error uploading file:', error);
	}
}

(async () => {
	intro('Choose an option:');

	const action = (await select({
		message: 'What would you like to do?',
		options: [
			{ value: 'upload', label: 'Upload a file' },
			{ value: 'download', label: 'Download a file' },
		],
	})) as 'upload' | 'download';

  const actionMap = {
    upload: handleFileUpload,
    download: () => note('Coming soon!', 'info'),
  }

	await actionMap[action]?.();

	outro(`🫡`);
})();
