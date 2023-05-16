function tabs(tabsSelector, tabsContenSelector, tabsParentSelector, activeSelector) {
	
	const tabs = document.querySelectorAll(tabsSelector),
		tabsContent = document.querySelectorAll(tabsContenSelector),
		tabsParent= document.querySelector(tabsParentSelector);

	function hideTabsContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show');
		});

		tabs.forEach(item => {
			item.classList.remove(activeSelector);
		});
	}
    
	function showTabsContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add(activeSelector);
	}

	hideTabsContent();
	showTabsContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.classList.contains(tabsSelector.slice(1))) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabsContent();
					showTabsContent(i);
				}
			});
		}
	});
}

export default tabs;