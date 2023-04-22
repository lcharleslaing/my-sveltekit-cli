#!/usr/bin/env node
const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const open = require('open');
const { execSync } = require('child_process');
const fs = require('fs');

const git = simpleGit();

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter your SvelteKit project name:',
    },
];

inquirer.prompt(questions).then(async (answers) => {
    const projectName = answers.projectName
        .split(' ')
        .map((word) => word.toLowerCase())
        .join('_');
    const projectDir = `${process.cwd()}/${projectName}`;

    try {
        // Create a new directory for the project
        fs.mkdirSync(projectDir);

        // Change to the new directory
        process.chdir(projectDir);

        // Clone the starter template repository
        await git.clone('https://github.com/lcharleslaing/sveltekit-starter-template.git', projectDir, { '--depth': 1 });

        // Initialize a new git repository in the project directory
        await git.init();

        // Install the project dependencies
        console.log('Installing dependencies...');
        execSync('npm install', { stdio: 'inherit' });

        // Open the project in VSCode
        console.log('Opening the project in Visual Studio Code...');
        await open(projectDir, { app: 'Visual Studio Code', wait: true });
    } catch (error) {
        console.error('Error:', error);
    }
});