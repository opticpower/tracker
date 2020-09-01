import { Iteration } from '../types';
import { AnyAction } from 'redux';

export const ADD_ITERATIONS = 'ADD_ITERATIONS';

export const addIterations = (iterations: Iteration[]): AnyAction => ({
  type: ADD_ITERATIONS,
  iterations,
});
