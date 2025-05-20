import { useContext } from 'react';
import {CountersContext} from '../context/CountersContext';

const useCounters = () => {
  return useContext(CountersContext);
};

export default useCounters;
