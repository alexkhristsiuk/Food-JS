function calculator() {

	const result = document.querySelector('.calculating__result span');

	let sex, age, weight, height, ratio;

	function bindLocalstorageWithActiveclass(selector, activeStyle) {
		const elements = document.querySelectorAll(selector);

		elements.forEach(elem => {
			elem.classList.remove(activeStyle);
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeStyle);
			}

			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeStyle);
			}
		});
	} 

	bindLocalstorageWithActiveclass('#gender div', 'calculating__choose-item_active');
	bindLocalstorageWithActiveclass('.calculating__choose_big div', 'calculating__choose-item_active');

	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	} else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	} else {
		ratio = '1.375';
		localStorage.setItem('ratio', 1.375);
	}

	function calcTotal() {
		if (!sex || !age || !height || !weight || !ratio) {
			result.textContent = '____';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
		} else {
			result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
		}
	}

	calcTotal();

	function getStaticInformation(selector, activeStyle) {
		const elements = document.querySelectorAll(selector);
		
		elements.forEach(elem => {
			elem.addEventListener('click', (e) => {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
				} else {
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex',  e.target.getAttribute('id'));
				}
	
				elements.forEach(item => {
					item.classList.remove(activeStyle);
				});
	
				e.target.classList.add(activeStyle);
	
				calcTotal();
			});
		});
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active');
	getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);
		
		input.addEventListener('input', () => {
			if (input.value.match(/\D/g)) {
				input.style.border = '2px solid red';
			} else {
				input.style.border = 'none';
			}

			switch(input.getAttribute('id')) {
			case 'height':
				height = +input.value;
				break;
			case 'weight':
				weight = +input.value;
				break;
			case 'age':
				age = +input.value;
				break;
			}		

			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
}

export default calculator;