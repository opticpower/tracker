import { useEffect, useState } from 'react';
import { ButtonDropdown } from '@geist-ui/react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const ProjectPicker = ({ id }) => {
  const { apiToken } = parseCookies();
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getProjects = async () => {
      const result = await fetch('https://www.pivotaltracker.com/services/v5/projects', {
        headers: {
          'X-TrackerToken': apiToken,
        },
      });
      setProjects(await result.json());
    };
    getProjects();
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
