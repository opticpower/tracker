import { useSelector } from 'react-redux';

import { getApiKey } from '../redux/selectors/settings.selectors';
import { getSelectedProjectId } from '../redux/selectors/stories.selectors';
import useAsync from './useAsync';

const usePivotal = (
  asyncFn,
  initialVal = {}
): [{ result: any; isLoading: boolean; error: any }, (...args) => void] => {
  const apiKey = useSelector(getApiKey);
  const projectId = useSelector(getSelectedProjectId);
  return useAsync(() => asyncFn({ apiKey, projectId }), initialVal);
};

export default usePivotal;
