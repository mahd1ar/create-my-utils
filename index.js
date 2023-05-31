#!/usr/bin/env node

import select, { Separator } from '@inquirer/select';
import fetch from 'node-fetch';
import { execSync, spawnSync } from 'child_process';


/**
 * 
 * @returns {Promise<{
 * sha: string,
 * url: string,
 * tree: 
 *  {
 *      path: string,
 *      mode: string,
 *      type: string,
 *      sha: string,
 *      size: number,
 *      url: string
 * }[]  | { sha : string, node_id: string, size: number, url: string, content: encoding: string }
 *}>
 */
async function fetchAPI(url = '') {


    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;


}

/**
 * 
 * @param {string} url 
 * @param {string} path 
 */
async function visualizeRepo(url, path) {
    const data = await fetchAPI(url)

    if (data.tree) {

        const answer = await select({
            message: 'Select file or path',
            choices: data.tree.map(i => ({
                name: i.type === 'tree' ? `[] ${i.path} ->` : i.path,
                value: { url: i.url, path: i.path },
            }))
        });

        const npath = (path + '/' + answer.path)

        visualizeRepo(answer.url, npath)

    } else {
        const x = execSync(`curl -L https://raw.githubusercontent.com/mahd1ar/microzist/master/${path}`)

        console.log(x.toString())
    }

}


visualizeRepo('https://api.github.com/repos/mahd1ar/microzist/git/trees/master', '')

// const answer = await select({
//     message: 'Select a package manager',
//     choices: [
//         {
//             name: 'npm',
//             value: 'npm',
//             description: 'npm is the most popular package manager',
//         },
//         {
//             name: 'yarn',
//             value: 'yarn',
//             description: 'yarn is an awesome package manager',
//         },
//         new Separator(),
//         {
//             name: 'jspm',
//             value: 'jspm',
//             disabled: true,
//         },
//         {
//             name: 'pnpm',
//             value: 'pnpm',
//             disabled: '(pnpm is not available)',
//         },
//     ],
// });

