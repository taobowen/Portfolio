
import React from 'react';

export default function About() {
  return (
    <div className="about-markdown" dangerouslySetInnerHTML={{ __html: "<h1>About Me</h1>\n<p>Welcome to my portfolio!<br>This page is dedicated to sharing who I am, what I do, and what I care about.<br>You can customize this markdown file to include your background, philosophy, or achievements.</p>\n" }} />
  );
}