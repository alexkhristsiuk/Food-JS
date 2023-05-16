function openModal (modalSelector, modalTimer) {
	const modal = document.querySelector(modalSelector);
	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	clearInterval(modalTimer);
}

function closeModalWindow(modalSelector) {
	const modal = document.querySelector(modalSelector);
	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

function modal(triggerSelector, modalSelector, modalTimer) {
	//Modal

	const btnsModal = document.querySelectorAll(triggerSelector),
		modal = document.querySelector(modalSelector);



	btnsModal.forEach(btn => {
		btn.addEventListener('click', () => openModal(modalSelector, modalTimer));
	});

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.dataset.close =='') {
			closeModalWindow(modalSelector);
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModalWindow(modalSelector);
		}
	});

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal(modalSelector, modalTimer);
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal, closeModalWindow};