# file-share-cli
![npm](https://img.shields.io/npm/v/share-files-cli.svg)

File sharing from command line...
- Set a secret passcode to share a file. A public shared key will be generated with it.
- Share this key and the passcode with whom the file will be shared.
- Anyone with the key and the passcode gets a one time chance to download the file.
- Once a file is downloaded the credentials become invalid and all traces of the file gets destroyed to prevent another download.
- Depends on [this repo](https://github.com/FahadulShadhin/fs-server) for file handling logic.

### Use:

```bash
npx share-files-cli
```

### Upload:
![Upload](./public/upload.gif)

### Download:
![Download](./public/download.gif)

<!-- https://github.com/user-attachments/assets/a140fc49-d914-468c-81f5-33eb23c2ca51 -->
