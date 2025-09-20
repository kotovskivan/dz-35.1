import "./styles/main.css"

const el = document.getElementById("app")
const img = new Image()
img.src = new URL("./assets/images/logo.png", import.meta.url)
img.alt = "logo"
img.className = "logo"
const btn = document.createElement("a")
btn.className = "btn"
btn.href = "#"
btn.textContent = _.join(["Hello", "Webpack"], " ")
el.append(img, btn)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
