document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.querySelector('#bookSearch');
	const filterButtons = Array.from(document.querySelectorAll('.category-filter'));
	const books = Array.from(document.querySelectorAll('.book-card'));
	const emptyState = document.querySelector('#emptyState');
	const backToTopButton = document.querySelector('.back-to-top');
	const menuToggle = document.querySelector('.menu-toggle');
	const siteNav = document.querySelector('.site-nav');
	const header = document.querySelector('.site-header');
	const revealElements = Array.from(document.querySelectorAll('.reveal'));

	let activeCategory = 'all';

	const normalizeText = (value) => value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

	const updateBooks = () => {
		const query = normalizeText(searchInput.value.trim());
		let visibleCount = 0;

		books.forEach((book) => {
			const category = book.dataset.category;
			const searchableText = normalizeText([
				book.dataset.title,
				book.dataset.author,
				book.dataset.description,
				category,
			].join(' '));

			const matchesCategory = activeCategory === 'all' || category === activeCategory;
			const matchesSearch = searchableText.includes(query);
			const isVisible = matchesCategory && matchesSearch;

			book.hidden = !isVisible;

			if (isVisible) {
				visibleCount += 1;
				book.classList.remove('is-visible');
				requestAnimationFrame(() => book.classList.add('is-visible'));
			}
		});

		emptyState.hidden = visibleCount !== 0;
	};

	const setActiveCategory = (category) => {
		activeCategory = category;

		filterButtons.forEach((button) => {
			const isActive = button.dataset.category === category;
			button.classList.toggle('is-active', isActive);
			button.setAttribute('aria-pressed', String(isActive));
		});

		updateBooks();
	};

	const closeMobileMenu = () => {
		siteNav.classList.remove('is-open');
		menuToggle.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('menu-open');
	};

	const handleHeaderShadow = () => {
		header.classList.toggle('is-scrolled', window.scrollY > 10);
		backToTopButton.classList.toggle('is-visible', window.scrollY > 500);
	};

	filterButtons.forEach((button) => {
		button.setAttribute('aria-pressed', button.classList.contains('is-active') ? 'true' : 'false');

		button.addEventListener('click', () => {
			setActiveCategory(button.dataset.category);
		});
	});

	searchInput.addEventListener('input', updateBooks);

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

	backToTopButton.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	window.addEventListener('scroll', handleHeaderShadow, { passive: true });

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

	updateBooks();
	handleHeaderShadow();
});