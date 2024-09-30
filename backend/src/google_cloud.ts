
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

// Initialize GCS client
const storage = new Storage({
    keyFilename: process.env.GCS_KEY_FILE, // Path to the GCS service account key file
    projectId: process.env.GCS_PROJECT_ID  // Your Google Cloud project ID
});

// Define bucket
// const bucket = storage.bucket(process.env.GCS_BUCKET ?? "");
export const bucket = storage.bucket(process.env.GCS_BUCKET ?? "");

export const fetchGCSFolder = async (prefix: string, localPath: string): Promise<void> => {
    try {
        console.log(`Fetching folder from GCS: ${prefix}`);

        // List files with the given prefix
        const [files] = await bucket.getFiles({ prefix });

        console.log(`Found ${files.length} files`);

        // Download files in parallel
        await Promise.all(files.map(async (file) => {
            const destination = `${localPath}/${file.name.replace(prefix, "")}`;

            // Check if it's a directory (in GCS, directories end with '/')
            if (file.name.endsWith('/')) {
                // If it's a directory, ensure it's created locally
                console.log(`Creating directory ${destination}`);
                await createFolder(destination);
            } else {
                // If it's a file, ensure the directory exists, then download the file
                console.log(`Downloading ${file.name} to ${destination}`);
                await createFolder(path.dirname(destination));
                await file.download({ destination });
                console.log(`Downloaded ${file.name} to ${destination}`);
            }
        }));
    } catch (error) {
        console.error('Error fetching folder from GCS:', error);
    }
};


export const copyGCSFolder = async (sourcePrefix: string, destinationPrefix: string): Promise<void> => {
    try {
        // List files with the given prefix
        const [files] = await bucket.getFiles({ prefix: sourcePrefix });

        // Copy files in parallel
        await Promise.all(files.map(async (file) => {
            const destinationFileName = file.name.replace(sourcePrefix, destinationPrefix);
            await bucket.file(file.name).copy(bucket.file(destinationFileName));
            console.log(`Copied ${file.name} to ${destinationFileName}`);
        }));
    } catch (error) {
        console.error('Error copying folder on GCS:', error);
    }
};

export const saveToGCS = async (key: string, filePath: string, content: string): Promise<void> => {
    try {
        const destination = `${key}${filePath}`;
        const file = bucket.file(destination);

        // Save content to GCS
        await file.save(content);
        console.log(`Uploaded to ${destination}`);
    } catch (error) {
        console.error('Error uploading to GCS:', error);
    }
};

// Helper functions

function writeFile(filePath: string, fileData: Buffer): Promise<void> {
    return new Promise(async (resolve, reject) => {
        await createFolder(path.dirname(filePath));

        fs.writeFile(filePath, fileData, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function createFolder(dirName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(dirName, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
