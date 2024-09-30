import { Express } from "express";
import { copyGCSFolder } from "./google_cloud";
import express from "express";
import { bucket } from "./google_cloud";

/**
 * Checks if a project already exists for the given user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} language - The programming language of the project.
 * @returns {Promise<boolean>} - A promise that resolves to true if the project exists, and false otherwise.
 */
async function projectExists(userId: string, language: string): Promise<boolean> {
    // database check
    const [files] = await bucket.getFiles({ prefix: `code/${userId}` });
    return files.length > 0;
}

/**
 * Fetches the project files for the given user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} language - The programming language of the project.
 * @returns {Promise<any>} - A promise that resolves to the project files.
 */
async function fetchProject(userId: string, language: string): Promise<any> {
    // database check
    const [files] = await bucket.getFiles({ prefix: `code/${userId}` });
    return files;
}

/**
 * Initializes the HTTP server and sets up the necessary routes.
 * @param {Express} app - The Express app object.
 */
export function initHttp(app: Express) {
    app.use(express.json());

    app.post("/project", async (req, res) => {
        const { userId, language } = req.body;

        if (!userId) {
            res.status(400).send("Bad request");
            return;
        }

        console.log("Checking project", userId, language);

        if (await projectExists(userId, language)) {
            const project = await fetchProject(userId, language);
            res.send(`Project already exists: ${JSON.stringify(project)}`);
            return;
        }

        console.log("Creating project", userId, language);

        await copyGCSFolder(`base/${language}`, `code/${userId}`);

        res.send("Project created");
    });
}