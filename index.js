#!/usr/bin/env node

import select, { Separator } from '@inquirer/select';
import fetch from 'node-fetch';
import { execSync, spawnSync } from 'child_process';

const REPO = 'create-my-utils'
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
 * @param {string} str 
 */
function camelToHuman(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2').toLowerCase()
}

/**
 * 
 * @param {string} url 
 * @param {string} path 
 */
async function visualizeRepo(url, path = "") {
    const data = await fetchAPI(url)

    if (data.tree) {

        const answer = await select({
            message: 'Select file or path',
            choices: data.tree.map(i => ({
                name: i.type === 'tree' ? `[] ${camelToHuman(i.path)} ->` : camelToHuman(i.path),
                value: { url: i.url, path: i.path },
            }))
        });

        const npath = (path + '/' + answer.path)

        visualizeRepo(answer.url, npath)

    } else {
        const content = execSync(`curl -L https://raw.githubusercontent.com/mahd1ar/${REPO}/master/${path}`)

        const mode = (x.toString().split(/\r?\n/)[0])
            .replace(/\/\/|#/g, "")
            .replace(/<!--|-->/g, "")
            .replace(/\s*/g, '')
        console.log("> mode is " + mode)

        switch (mode) {
            case 'read':
                console.log(content.toString());
                break;

            case 'write':
                execSync(`curl -LOC - https://raw.githubusercontent.com/mahd1ar/${REPO}/master/${path}`)
                break;

            default:
                break;
        }


    }

}

async function startFrom(url, path) {
    const data = await fetchAPI(url)
    if (!data.content) {
        const ndata = await fetchAPI(data.tree.find(i => i.path === path).url)
        return ndata.url
    }

}
visualizeRepo(
    await startFrom(`https://api.github.com/repos/mahd1ar/${REPO}/git/trees/master`, 'src')

    , 'src')


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

