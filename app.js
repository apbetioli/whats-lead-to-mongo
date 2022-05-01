const fs = require('fs');
const readline = require('readline');
const db = require('./db')
const md5 = require('md5')
const moment = require('moment')

async function processLine(line) {
    const saiu = line.includes('saiu')
    const entrou = line.includes('entrou')
    if (saiu || entrou) {
        const date = moment(line.substring(0, 16), 'DD/MM/YYYY hh:mm:ss').toDate()

        const end = saiu ? line.indexOf('saiu') : line.indexOf('entrou')
        const phone = line.substring(19, end - 1)

        const hash = md5(line)

        const doc = {
            date,
            entrou,
            phone,
            hash
        }

        return doc
    }
}

async function processLineByLine(filename) {
    const fileStream = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const docs = []

    for await (const line of rl) {
        const doc = await processLine(line)
        if (doc)
            docs.push(doc)
    }

    console.log(docs)

    const result = await db.insertManyLogs(docs)
    console.log(`${result.insertedCount} documents were inserted`);

}

function main() {
    const myArgs = process.argv.slice(2);
    if (myArgs.length > 0)
        processLineByLine(myArgs[0]);
}

if (require.main === module) {
    main();
}