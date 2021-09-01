const fs = require('fs')
const path = require('path')
const readline = require('readline')


const TARGET_FILE = 'target-data.txt'
const HEADER_LINE_REGEXP = /.*[\d]+\:[\d]+\:[\d]+/
const TARGET_LINE_REGEXP = /\В\ы.*[\d]+\:[\d]+\:[\d]+/

let targetLineFlag = false
let targetAreaFlag = false

let finalString = ''

const catchContent = async (rl) => {
    for await (const line of rl) {
        if (targetLineFlag) targetAreaFlag = true // target message first line
        if (HEADER_LINE_REGEXP.test(line))  targetAreaFlag = targetLineFlag = false
        if (TARGET_LINE_REGEXP.test(line))  targetLineFlag = true

        if (targetAreaFlag) {
            finalString = finalString + `\n` + line
        }
    }
}

const parseByLines = async () => {
    const fileStream = fs.createReadStream(path.join(__dirname, 'script.txt'))

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    await catchContent(rl)

    fs.writeFileSync(path.join(__dirname, TARGET_FILE), finalString);
}

parseByLines()