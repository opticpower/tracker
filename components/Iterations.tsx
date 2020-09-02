import { useEffect } from 'react';
import { ButtonDropdown } from '@geist-ui/react';
import { parseCookies } from 'nookies';
import { useSelector, useDispatch } from 'react-redux';
import { State, Iteration } from '../redux/types';
import { addIterations } from '../redux/actions/iterations.actions';
import { parseISO, format } from 'date-fns';

interface IterationsParams {
  id: string;
  selectedIteration?: Iteration;
  addIteration: (name: string, filter: Iteration) => void;
  removeIteration: (name: string, filter: Iteration) => void;
}

const Iterations = ({ id, selectedIteration, addIteration, removeIteration }: IterationsParams): JSX.Element => {
  const { apiToken } = parseCookies(); //todo: move to redux
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
              'X-TrackerToken': apiToken,
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
    <ButtonDropdown>
      <ButtonDropdown.Item
        main={!Boolean(selectedIteration)} //todo: add the selected iteration to state.
        onClick={(): void => {
          removeIteration('iterations', null);
        }}
      >
        No Iteration
      </ButtonDropdown.Item>
      {iterations.map(
        (iteration: Iteration): JSX.Element => {
          return (
            <ButtonDropdown.Item
              key={iteration.number}
              id={String(iteration.number)}
              main={iteration.number === selectedIteration?.number} //todo: add the selected iteration to state.
              onClick={(): void => {
                addIteration('iterations', iteration);
              }}
            >
              {formatDate(iteration.start)} - {formatDate(iteration.finish)}
            </ButtonDropdown.Item>
          );
        }
      )}
    </ButtonDropdown>
  );
};

export default Iterations;
