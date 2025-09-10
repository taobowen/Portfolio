import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, HashRouter as Router } from "react-router-dom";
import Layout from "./layout.jsx"; // your existing layout component
import { Flipper, Flipped } from "react-flip-toolkit";
import ProjectCard from "./projectCard.jsx";
import pageMap from './pageMap.js';


export default function App() {
  const [rawList, setRawList] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Created");
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    fetch("./rawList.json")
      .then((res) => res.json())
      .then(setRawList)
      .catch((err) => console.error("Failed to load project list", err));
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width >= 1360) setColumns(3);
      else if (width >= 680) setColumns(2);
      else setColumns(1);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const chunkProjects = (projects, columns) => {
    const rows = [];
    for (let i = 0; i < projects.length; i += columns) {
      rows.push(projects.slice(i, i + columns));
    }
    return rows;
  };

  const chunked = chunkProjects(rawList, columns);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                rawList={rawList}
                filterCategory={filterCategory}
                sortOrder={sortOrder}
                setFilterCategory={setFilterCategory}
                setSortOrder={setSortOrder}
              />
            }
          >
            <Route
              index
              element={
                <Flipper flipKey={columns}>
                  <div className="project-list">
                    {chunked.map((row, rowIndex) => (
                      <div className="project-row" key={rowIndex}>
                        {row
                          .filter(
                            (project) =>
                              filterCategory === "All" || project.category === filterCategory
                          )
                          .sort((a, b) => {
                            if (sortOrder === "Created") {
                              return new Date(b.created) - new Date(a.created);
                            } else {
                              return new Date(b.updated) - new Date(a.updated);
                            }
                          })
                          .map((project) => (
                            <Flipped key={project.path} flipId={project.path} id={project.path}>
                              <ProjectCard project={project} />
                            </Flipped>
                          ))}
                      </div>
                    ))}
                  </div>
                </Flipper>
              }
            />
            {Object.entries(pageMap).map(([path, Comp]) => (
                <Route key={path} path={path} element={<Comp />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
