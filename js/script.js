'use strict';

document.addEventListener('DOMContentLoaded', () => {

	//Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent= document.querySelector('.tabheader__items');

	function hideTabsContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}
    
	function showTabsContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabsContent();
	showTabsContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabsContent();
					showTabsContent(i);
				}
			});
		}
	});

	//Timer

	const deadline = '2023-05-11';

	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t < 0) {
			return {
				total: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			};
		} else {
			days = Math.floor((t / (1000 * 60 * 60 * 24))),
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / (1000 * 60)) % 60),
			seconds = Math.floor((t / 1000) % 60);
			return {
				'total': t,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};
		}
	}

	function getZero (num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();//вызываем для того чтобы при обновлении страницы сразу показывало текущий таймер а не указанный в верстке
		function updateClock () {
			const t = getTimeRemaining(endtime);
			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}
	setClock('.timer', deadline);

	//Modal

	const btnsModal = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	function openModal () {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimer);
	}
    
	btnsModal.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function closeModalWindow() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.dataset.close =='') {
			closeModalWindow();
		}
	});
 
	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModalWindow();
		}
	});

	const modalTimer = setTimeout(openModal, 50000);

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	//Cards

	class MenuCards {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.parent = document.querySelector(parentSelector);
			this.classes = classes;
			this.course = 32;
			this.changeToUAH();
		}

		changeToUAH() {
			return this.price = this.price * this.course;
		}

		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}
			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
           `;
			this.parent.append(element);
		}
	}

	const getResources = async (url) => {
		const res = await fetch(url);
		if(!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	getResources('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({img, altimg, title, descr, price}) => {
				new MenuCards(img, altimg, title, descr, price, '.menu .container').render();
			});
		});

	//Forms

	const forms = document.querySelectorAll('form');
	const message = {
		loading: 'img/forms/spinner.svg',
		success: 'Спасибо! Мы Вам перезвоним.',
		failure: 'Что-то пошло не так...'
	};

	forms.forEach(item => {
		bindData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});
		return await res.json();
	};

	function bindData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		prevModalDialog.classList.remove('show');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModalWindow();
		}, 4000);
	}

	fetch('http://localhost:3000/menu')
		.then(data => data.json())
		.then(res => console.log(res));
});