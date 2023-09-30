function bigPromise<T>(fn: (err: Error, data: T) => void) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    fn((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export default bigPromise;
