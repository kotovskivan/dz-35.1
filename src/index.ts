import "./styles/test.scss";
import "./styles/test.less";

const app = document.getElementById("app");
if (app) {
  app.innerHTML = "<p>TypeScript is working</p>";
}

console.log("TS + SCSS + LESS + Babel + ESLint готові до роботи");
