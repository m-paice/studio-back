const fs = require('fs-extra');

const copyFolderRecursiveSync = (source, target) =>
  new Promise((resolve, reject) => {
    fs.copy(source, target, (err) => {
      if (err) {
        console.error(err);
        return resolve(false);
      }
      console.log('success!');
      return resolve(true);
    });
  });

export default copyFolderRecursiveSync;
