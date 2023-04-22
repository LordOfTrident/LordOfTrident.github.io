let buttonBackToTop  = document.getElementById("back-to-top")
let buttonDarkTheme  = document.getElementById("dark-theme")
let buttonLightTheme = document.getElementById("light-theme")

let menu = document.getElementById("menu")

function backToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

function setTheme(name) {
	switch (name) {
	case "light":
		document.documentElement.className = "light"
		buttonLightTheme.style.display = "none"
		buttonDarkTheme.style.display  = "block"
		break

	case "dark":
		document.documentElement.className = "dark"
		buttonDarkTheme.style.display  = "none"
		buttonLightTheme.style.display = "block"
		break
	}
}

function openMenu() {
	if (menu.classList.contains("menu-responsive"))
		menu.classList.remove("menu-responsive")
	else
		menu.classList.add("menu-responsive")
}

window.onscroll = () => {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
		buttonBackToTop.style.opacity = 1
	else
		buttonBackToTop.style.opacity = 0
}
