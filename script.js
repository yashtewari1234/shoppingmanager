const itemList = document.getElementById('itemList');
const scraper = new autoscraper.Scraper();

function scrapeData() {
	const link = document.getElementById('link').value;
	scraper.get(link).then(data => {
		const items = data.map(item => {
			return {
				name: item.name,
				price: item.price,
				available: item.available
			};
		});

		displayItems(items);
	}).catch(error => {
		console.error(error);
		alert('An error occurred while scraping data.');
	});
}

function displayItems(items) {
	itemList.innerHTML = '';

	if (items.length === 0) {
		itemList.innerHTML = '<tr><td colspan="4">No items found.</td></tr>';
		return;
	}

	items.forEach(item => {
		const row = document.createElement('tr');

		const nameCell = document.createElement('td');
		nameCell.innerText = item.name;
		row.appendChild(nameCell);

		const priceCell = document.createElement('td');
		priceCell.innerText = item.price;
		row.appendChild(priceCell);

		const availableCell = document.createElement('td');
		availableCell.innerText = item.available ? 'In Stock' : 'Out of Stock';
		availableCell.classList.add(item.available ? 'in-stock' : 'out-of-stock');
		row.appendChild(availableCell);

		const statusCell = document.createElement('td');
		statusCell.innerText = 'Pending';
		row.appendChild(statusCell);

		itemList.appendChild(row);

		checkItemStatus(item, statusCell);
	});
}

async function checkItemStatus(item, statusCell) {
	const response = await fetch(item.link);
	const html = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');

	if (doc.querySelector('#add-to-cart-button')) {
		statusCell.innerText = 'Available';
		statusCell.classList.add('in-stock');
	} else {
		statusCell.innerText = 'Not Available';
		statusCell.classList.add('out-of-stock');
	}
}
