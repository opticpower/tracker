import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getApiKey } from '../redux/selectors/settings.selectors';
import { getSelectedProjectId } from '../redux/selectors/stories.selectors';

const usePivotal = (
  asyncFn,
  initialVal = {}
): [
  { result: any; isLoading: boolean; error: any },
  (apiKey: string, projectId: string) => void
] => {
  const [result, setResult] = useState(initialVal);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();
  const apiKey = useSelector(getApiKey);
  const projectId = useSelector(getSelectedProjectId);

  const doAsyncFn = async (...args) => {
    setLoading(true);
    setError(undefined);
    try {
      setResult(await asyncFn({ apiKey, projectId }, ...args));
    } catch (err) {
      console.error(err);
      setError(err);
    }
    setLoading(false);
  };

  return [{ result, isLoading, error }, doAsyncFn];
};

export default usePivotal;
