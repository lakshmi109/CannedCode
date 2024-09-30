import fs from "fs";

interface FileEntry {
    type: "file" | "dir";
    name: string;
    path: string;
}

/**
 * Fetches the list of files and directories from a given directory.
 * @param dir - The target directory to read.
 * @param baseDir - The base directory path to prepend to file entries.
 * @returns A promise that resolves to an array of FileEntry objects.
 */
export const fetchDirectoryContents = (dir: string, baseDir: string): Promise<FileEntry[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (error, entries) => {
            if (error) {
                return reject(error);
            }

            const result: FileEntry[] = entries.map(entry => ({
                type: entry.isDirectory() ? "dir" : "file",
                name: entry.name,
                path: `${baseDir}/${entry.name}`
            }));

            resolve(result);
        });
    });
}

/**
 * Reads the content of a specified file.
 * @param filePath - The file to be read.
 * @returns A promise that resolves to the file content as a string.
 */
export const readFileContent = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (error, data) => {
            if (error) {
                return reject(error);
            }

            resolve(data);
        });
    });
}

/**
 * Writes the specified content to a file.
 * @param filePath - The target file to write to.
 * @param content - The content to be written.
 * @returns A promise that resolves once the content is successfully written.
 */
export const writeFile = async (filePath: string, content: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, "utf8", (error) => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}
