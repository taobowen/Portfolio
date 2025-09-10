import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import About from "./pages/About";

export default function Layout({ rawList, setFilterCategory, setSortOrder, filterCategory, sortOrder }) {
  const [profileExpanded, setProfileExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleProfile = () => setProfileExpanded((prev) => !prev);

  return (
    <div className="template">
      <div className={`overlay ${profileExpanded ? "overlay-visible" : "overlay-hide"}`} onClick={toggleProfile}></div>
      <div className={`profile ${profileExpanded ? "profile-expanded" : ""}`}>
        <div className="profile-bar">
          <div
            className="profile-text"
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                toggleProfile();
              }
            }}
          >
            {location.pathname === "/" ? "Portfolio" : "Back to Home"}
          </div>
          <div className="profile-icon" onClick={toggleProfile}>
            {profileExpanded ? <FiX /> : <FiMenu />}
          </div>
        </div>
        <div className={`profile-content ${profileExpanded ? "profile-content-expanded" : ""}`}>
          <div className="profile-subtitle">About</div>
          <div className="profile-subcontent">
            <About />
          </div>
          <div className="profile-subtitle">Filters</div>
          <div className="profile-subcontent">
            {['All', ...Array.from(new Set(rawList.map(project => project.category)))].map((category, index) => (
              filterCategory !== category ? (
                <div key={index}><a onClick={() => setFilterCategory(category)} className="filter-categories">◦ {category}</a></div>
              ) : (
                <div key={index}><b className="filter-categories">• {category}</b></div>
              )
            ))}
          </div>
          <div className="profile-subtitle">Sort By</div>
          <div>
            {sortOrder !== "Created" ? (
              <a onClick={() => setSortOrder("Created")}>◦ Created</a>
            ) : (
              <div><b>• Created</b></div>
            )}
            {sortOrder !== "Updated" ? (
              <a onClick={() => setSortOrder("Updated")}>◦ Updated</a>
            ) : (
              <div><b>• Updated</b></div>
            )}
          </div>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
