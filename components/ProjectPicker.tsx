import { useEffect } from 'react';
import { ButtonDropdown } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { State, Project } from '../redux/types';
import { addProjects } from '../redux/actions/projects.actions';
import { getApiKey } from '../redux/selectors/settings.selectors';

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
        const result = await fetch('https://www.pivotaltracker.com/services/v5/projects', {
          headers: {
            'X-TrackerToken': apiKey,
          },
        });

        const projects = await result.json();

        dispatch(addProjects(projects));
      };
      getProjects();
    }
  }, []);

  return (
    <ButtonDropdown>
      {projects.map(project => {
        return (
          <ButtonDropdown.Item
            key={project.id}
            id={project.id}
            main={project.id.toString() === id}
            onClick={() => {
              router.push(`/projects/${project.id}`);
            }}
          >
            {project.name}
          </ButtonDropdown.Item>
        );
      })}
    </ButtonDropdown>
  );
};

export default ProjectPicker;
