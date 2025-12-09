import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "CPC Reports",
  version: packageJson.version,
  copyright: `© ${currentYear}, CPC Reports.`,
  meta: {
    title: "CPC Reports",
    description:
      "CPC Reports",
  },
};
