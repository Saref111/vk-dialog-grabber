const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer');



let dirs = []

const promiseSetTimeout = timeout => new Promise(r => setTimeout(r, timeout));

const waitManyTimes = async (arr, folder, cb) => {
    for(let i = 0; i < arr.length; i++) {
        cb(arr[i], folder)
        await promiseSetTimeout(1000);
        console.log(i);
    }
}

const getString = (arr) => {
    return arr.reduce((acc, it) => {
        return acc = acc + it
    }, '')
}

const getFile = async (filename, foldername) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`file://${path.join(__dirname, 'messages', foldername, filename)}`);

    const m = await page.$$eval('.message', (nodes) => nodes.map((n) => n.textContent))

    fs.writeFileSync('test.txt', getString(m))

    await browser.close();
}

const getFilesFromFolder = (folder) => {

    let allFiles = fs.readdirSync(path.join(__dirname, 'messages', folder))
    
    if (Array.isArray(allFiles)) {

        waitManyTimes(allFiles, folder, getFile)

    }
}


fs.readdir(path.join(__dirname, 'messages'), (err, files) => {
    dirs = files

    // dirs.forEach(it => getFilesFromFolder(it))
    waitManyTimes(dirs, null, getFilesFromFolder)
})  