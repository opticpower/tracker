import { Select } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PivotalHandler from '../handlers/PivotalHandler';
import { addProjects } from '../redux/actions/projects.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';
import { Project, State } from '../redux/types';

const ProjectPicker = ({ id }): JSX.Element => {
  const apiKey = useSelector(getApiKey);
  const router = useRouter();

  const projects = useSelector((state: State): Project[] => {
    return state.projects;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!projects.length) {
      //todo: move this out to an action

      const getProjects = async () => {
        const projects = await PivotalHandler.fetchProjects({ apiKey });
        dispatch(addProjects(projects));
      };
      getProjects();
    }
  }, []);

  return (
    <Select
      disableMatchWidth
      width="200px"
      value={`${id}`}
      onChange={id => router.push(`/projects/${id}`)}>
      {projects.map(project => {
        return (
          <Select.Option key={project.id} id={project.id} value={`${project.id}`}>
            {project.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default ProjectPicker;
