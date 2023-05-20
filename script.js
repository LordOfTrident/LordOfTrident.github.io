let buttonBackToTop  = document.getElementById("back-to-top")
let buttonDarkTheme  = document.getElementById("dark-theme")
let buttonLightTheme = document.getElementById("light-theme")
let siteNav          = document.getElementById("site-nav")
let shadowBegin      = 0
if (siteNav)
	shadowBegin = siteNav.getBoundingClientRect().top

function getCookie(name) {
	let value = `; ${document.cookie}`
	let parts = value.split(`; ${name}=`)
	if (parts.length === 2)
		return parts.pop().split(';').shift()
}

function backToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

window.onscroll = () => {
	if (document.body.scrollTop > shadowBegin || document.documentElement.scrollTop > shadowBegin) {
		if (siteNav)
			siteNav.classList.add("shadow")

		buttonBackToTop.style.opacity = 1
	} else {
		if (siteNav)
			siteNav.classList.remove("shadow")

		buttonBackToTop.style.opacity = 0
	}
}

function setTheme(name) {
	switch (name) {
	case "light":
		document.cookie = "theme=light; path=/"
		document.documentElement.className = "light"
		break

	case "dark":
		document.cookie = "theme=dark; path=/"
		document.documentElement.className = "dark"
		break
	}
}

let theme = getCookie("theme")
if (theme)
	setTheme(theme)
else
	setTheme("light")
