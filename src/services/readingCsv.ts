import csv from 'csv-parser';
import fs from 'fs';

const readingFile = (file: string, separator = ','): Promise<any> => {
  const result = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv({ separator }))
      .on('data', (row: any) => {
        result.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(result);
      });
  });
};

export default readingFile;
