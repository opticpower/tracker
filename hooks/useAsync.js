import { useState } from 'react';

export default (asyncFn, initialVal = {}) => {
  const [result, setResult] = useState(initialVal);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const doAsyncFn = async (...args) => {
    setLoading(true);
    setError(undefined);
    try {
      setResult(await asyncFn(...args));
    } catch (err) {
      console.error(err);
      setError(err);
    }
    setLoading(false);
  };

  return [{ result, isLoading, error }, doAsyncFn];
};
