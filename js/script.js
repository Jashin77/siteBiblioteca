document.addEventListener('DOMContentLoaded', () => {
	const menuToggle = document.querySelector('.menu-toggle');
	const siteNav = document.querySelector('.site-nav');
	const revealElements = Array.from(document.querySelectorAll('.reveal'));

	const closeMobileMenu = () => {
		siteNav.classList.remove('is-open');
		menuToggle.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('menu-open');
	};

	menuToggle.addEventListener('click', () => {
		const isOpen = siteNav.classList.toggle('is-open');
		menuToggle.setAttribute('aria-expanded', String(isOpen));
		document.body.classList.toggle('menu-open', isOpen);
	});

	siteNav.addEventListener('click', (event) => {
		if (event.target.closest('a')) {
			closeMobileMenu();
		}
	});

	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.15,
	});

	revealElements.forEach((element) => revealObserver.observe(element));
});