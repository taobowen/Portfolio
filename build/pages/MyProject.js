
import React from 'react';

export default function MyProject() {
  return (
    <div dangerouslySetInnerHTML={{ __html: "<div style=\"padding: 9rem 4.5rem;\"><h1>my-project</h1><h2 style=\"color: #4a4a4a; font-weight: normal;\">Describe your project here.</h2></div><div style=\"padding: 0 4.5rem 4.5rem;\"><h1>my-project</h1>\n</div>" }} />
  );
}