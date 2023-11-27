import { readFileSync, writeFileSync } from 'fs';
export const writeDataToFile = (filename, content) => {
    try {
        writeFileSync(filename, JSON.stringify(content), 'utf8');
    }
    catch (err) {
        console.log(err);
    }
};
export const readDataFromFile = (filename) => {
    try {
        const data = readFileSync(filename, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        console.error(err);
        return [];
    }
};
export const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
//# sourceMappingURL=utils.js.map