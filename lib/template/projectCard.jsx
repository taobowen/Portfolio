import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(project.path)}
      className="project-item"
      style={{ backgroundImage: `url('${project.coverUrl}')` }}
    >
      <div className="project-info">
        <div className="project-title">{project.title}</div>
        <div className="project-description">{project.description}</div>
      </div>
    </div>
  );
}