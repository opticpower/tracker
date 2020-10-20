import { Select } from '@geist-ui/react';
import { format, parseISO } from 'date-fns';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addIterations } from '../redux/actions/iterations.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';
import { Iteration, State } from '../redux/types';

interface IterationsParams {
  id: string;
  selectedIteration?: Iteration;
  addIteration: (filter: Iteration) => void;
  removeIteration: () => void;
}

const Iterations = ({
  id,
  selectedIteration,
  addIteration,
  removeIteration,
}: IterationsParams): JSX.Element => {
  const apiKey = useSelector(getApiKey);
  const iterations = useSelector((state: State): Iteration[] => {
    const iterations = state.iterations[id] || new Set();
    return Array.from(iterations);
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!iterations.length && Boolean(id)) {
      //todo: move this out to an action
      const getIterations = async () => {
        const result = await fetch(
          `https://www.pivotaltracker.com/services/v5/projects/${id}/iterations?limit=20&scope=current_backlog`,
          {
            headers: {
              'X-TrackerToken': apiKey,
            },
          }
        );

        const iterations = await result.json();
        dispatch(addIterations(iterations));
      };
      getIterations();
    }
  }, [id]);

  const formatDate = (date: string): string => format(parseISO(date), 'do MMM yy');

  return (
    <Select
      disableMatchWidth
      width="200px"
      value={String(selectedIteration?.number || -1)}
      onChange={val => {
        const number = Number(val);
        if (number === -1) {
          removeIteration();
        } else {
          addIteration(iterations.find(it => it.number === number));
        }
      }}>
      <Select.Option value="-1">All Iterations</Select.Option>
      {iterations.map(
        (iteration: Iteration): JSX.Element => {
          return (
            <Select.Option
              key={iteration.number}
              id={String(iteration.number)}
              value={String(iteration.number)}>
              {formatDate(iteration.start)} - {formatDate(iteration.finish)}
            </Select.Option>
          );
        }
      )}
    </Select>
  );
};

export default Iterations;
