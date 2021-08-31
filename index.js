const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer');

const MIN_INDEX = 50
const MAX_INDEX = 100
const MAX_LISTENERS = 5
const TIMEOUT = 1000

let dirs = []
let finalString = ''

const promiseSetTimeout = timeout => new Promise(r => setTimeout(r, timeout));

const waitManyTimes = async (arr, folder, cb) => {
    for(let i = 0; i < arr.length; i++) {
        await promiseSetTimeout(TIMEOUT);
        cb(arr[i], folder)
        console.info(i);
    }
}

const getString = (arr) => {
    return arr.reduce((acc, it) => {
        return acc = acc + it
    }, finalString)
}

const getStringFromFile = async (filename, foldername) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${path.join(__dirname, 'messages', foldername, filename)}`);
    const m = await page.$$eval('.message', (nodes) => nodes.map((n) => n.textContent))

    finalString = getString(m)
    await page.close();
    await browser.close();
}

const getFilesFromFolder = async (folder) => {
    
    let allFiles = fs.readdirSync(path.join(__dirname, 'messages', folder))

    if (Array.isArray(allFiles)) {
        allFiles.forEach((it) => getStringFromFile(it, folder))
    }

    fs.writeFileSync('test.txt', finalString)
}


fs.readdir(path.join(__dirname, 'messages'), async (err, files) => {
    if (err) throw new Error(err)
    let maxIndex = MAX_INDEX
    let minIndex = MIN_INDEX

    while (maxIndex < files.length) {
        const listeners = process.listenerCount('SIGINT')
        if (listeners > MAX_LISTENERS) {
            console.warn('Listeners ', listeners);
            await promiseSetTimeout(TIMEOUT * listeners);
            console.warn('Listeners after timeout', process.listenerCount('SIGINT'));
        }

        dirs = files.slice(minIndex, maxIndex)

        await waitManyTimes(dirs, null, getFilesFromFolder)

        minIndex = minIndex + MAX_INDEX
        maxIndex = maxIndex + MAX_INDEX
    }
    
})  



// DATA PROBLEM 
// 2000000006    messages10100.html
// 2000000006    messages10250.html
// 2000000006    messages10350.html
// 2000000006    messages10400.html
// 2000000006    messages1050.html
// 2000000006    messages10450.html
// 2000000006    messages10650.html
// 2000000006    messages10700.html
// 2000000006    messages10750.html