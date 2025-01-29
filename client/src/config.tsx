import alabamaCyberRangeLongLogo from "./assets/images/alabama_cyber_range_long_logo.svg";

export const baseConfig = {
  projectLink: "https://github.com/Alabama-Cyber-Range",
  docsRepositoryBase: "", // base URL for the docs repository
  titleSuffix: "",
  search: false,
  header: true,
  // headerText: "Alabama Cyber Range",
  footer: true,
  footerText: (
    <>
      <span>
      </span>
    </>
  ),

  logo: (
    <>
      {/* <img
        src={alabamaCyberRangeLongLogo}
        alt="logo"
        width="30"
        height="22"
      /> */}
        <img
        src={alabamaCyberRangeLongLogo}
      />
    </>
  ),
};

/// Navigation sidebar
export const appNavs = [
  {
    eventKey: "dashboard",
    title: "Dashboard",
    to: "/",
  },

  {
    eventKey: "modules",
    title: "Modules",
    to: "/modules",
  },
  {
    eventKey: "learning_paths",
    title: "Learning Paths",
    to: "/learning-paths",
  },
  {
    eventKey: "schools",
    title: "Schools",
    to: "/schools",
  },
  {
    eventKey: "users",
    title: "Users",
    to: "/users",
  },
];
