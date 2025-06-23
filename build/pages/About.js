
import React from 'react';

export default function About() {
  return (
    <div className="about-markdown" dangerouslySetInnerHTML={{ __html: "<p>about me, my projects, and more.</p>\n<p>if you want to know me, see my <a href=\"https://github.com/taobowen\">github</a>。</p>\n" }} />
  );
}
