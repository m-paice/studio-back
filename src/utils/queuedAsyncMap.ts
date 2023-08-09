import queue from 'async/queue';

// new array order may not be correct

export default <T, U>(
  items: T[],
  cb: (item: T, index: number) => Promise<U>,
  parallel = 5,
): Promise<U[]> => new Promise((resolve, reject) => {
  const newItems = [];

  const q = queue((item: T, callback) => {
    const index = items.indexOf(item);
    const maybePromise = cb(item, index);

    if (typeof maybePromise === 'object' && maybePromise.then) {
      maybePromise
        .then((newItem) => {
          newItems.splice(index, 0, newItem);
          callback();
        })
        .catch(reject);
    } else {
      newItems.splice(index, 0, maybePromise);
      callback();
    }
  }, parallel);

  // q.drain = () => resolve(newItems);
  q.drain(async () => {
    resolve(newItems);
  });
  q.push(items);
});
