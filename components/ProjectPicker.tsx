import { useEffect } from 'react';
import { Select } from '@geist-ui/react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { State, Project } from '../redux/types';
import { addProjects } from '../redux/actions/projects.actions';

const ProjectPicker = ({ id }): JSX.Element => {
  const { apiToken } = parseCookies(); //todo: move to redux
  const projects = useSelector((state: State): Project[] => {
    return state.projects;
  });
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!projects.length) {
      //todo: move this out to an action
      const getProjects = async () => {
        const result = await fetch(
          'https://www.pivotaltracker.com/services/v5/projects',
          {
            headers: {
              'X-TrackerToken': apiToken,
            },
          }
        );

        const projects = await result.json();

        dispatch(addProjects(projects));
      };
      getProjects();
    }
  }, []);

  return (
    <Select
      disableMatchWidth
      width='200px'
      value={`${id}`}
      onChange={(id) => router.push(`/projects/${id}`)}
    >
      {projects.map((project) => {
        return (
          <Select.Option
            key={project.id}
            id={project.id}
            value={`${project.id}`}
          >
            {project.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default ProjectPicker;
