export const SITE_NAME = "Vervue";
export const AUTHOR_NAME = "Angelo Juanico";
export const BRAND_NAME = "JuanicoDevSolutions";

export const SITE_DESCRIPTION =
    "Practice real interview questions and get scored AI feedback on every answer. Software engineer, product manager, data analyst, cyber security and behavioural (STAR) interviews.";

export const SOCIAL_LINKS = [
    "https://github.com/ajuan7",
    "https://www.linkedin.com/in/angelojuanico",
];

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
        ? "https://vervue.app"
        : "http://localhost:3000");