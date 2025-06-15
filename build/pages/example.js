
import React from 'react';

export default function example() {
  return (
    <div dangerouslySetInnerHTML={{ __html: "<div style=\"padding: 9rem 4.5rem;\"><h1>example</h1><h2 style=\"color: #4a4a4a; font-weight: normal;\">Describe your project here.</h2></div><div style=\"padding: 0 4.5rem 4.5rem;\"><h1>header</h1>\n<h2>header2</h2>\n<h3>header3</h3>\n<ul>\n<li>item1</li>\n<li>item2</li>\n</ul>\n<ol>\n<li>point1</li>\n<li>point2</li>\n</ol>\n<pre><code>code\n</code></pre>\n</div>" }} />
  );
}
