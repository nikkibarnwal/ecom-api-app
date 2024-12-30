import path from "path";

export const imagesPath = path.join(path.resolve(), "uploads");
export const uid = () => Date.now() + Math.floor(Math.random() * 1000000000);
