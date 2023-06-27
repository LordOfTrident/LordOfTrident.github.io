let buttonBackToTop = document.getElementById("back-to-top");
let header          = document.getElementById("site-header");

function getCookie(name) {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2)
		return parts.pop().split(';').shift();
}

function backToTop() {
	window.scrollTo({
		top:      0,
		behavior: "smooth",
	});
}

function setTheme(name) {
	switch (name) {
	case "light":
		document.cookie = "theme=light; path=/";
		document.documentElement.className = "light";
		break;

	case "dark":
		document.cookie = "theme=dark; path=/";
		document.documentElement.className = "dark";
		break;
	}
}

window.onscroll = () => {
	let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

	if (scrollTop > 20) {
		buttonBackToTop.style.opacity   = 1;
		header.style.backgroundPosition = "50% calc(" + (0 + (scrollTop - 20) / 2.5) + "px + 50%)";
	} else {
		buttonBackToTop.style.opacity   = 0;
		header.style.backgroundPosition = "center";
	}
}

let i     = 0;
let delay = 50;

let pageTitleText = document.getElementById("page-title-text");
let title         = getComputedStyle(pageTitleText).getPropertyValue("--title");
title = title.substr(1, title.length - 2);

pageTitleText.style.width = "2ch";
pageTitleText.innerHTML  += title;

function writeTitle() {
	if (i < title.length) {
		pageTitleText.style.width = i + 3 + "ch";

		++ i;
		setTimeout(writeTitle, delay);
	}
}

window.onload = () => {
	setTimeout(writeTitle, 800);
}

let theme = getCookie("theme");
if (theme)
	setTheme(theme);
else
	setTheme("light");
