from flask import Flask, request, jsonify
from autoscraper import AutoScraper

app = Flask(__name__)

scraper = AutoScraper()

def get_data_from_link(link):
    # Define the scraping pattern using a list of data we want to extract
    pattern = [
        'Product Name',
        'Product Price',
        'Product Availability'
    ]

    # Use the scrape() method to generate the scraper and extract data from the link
    data = scraper.build(link, pattern)

    # Format the scraped data into a list of dictionaries
    items = []
    for i in range(len(data['Product Name'])):
        item = {
            'name': data['Product Name'][i],
            'price': data['Product Price'][i],
            'available': data['Product Availability'][i]
        }
        items.append(item)

    return items

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/script.js')
def script():
    return app.send_static_file('script.js')

@app.route('/scrape')
def scrape():
    link = request.args.get('link')
    items = get_data_from_link(link)
    return jsonify(items)

if __name__ == '__main__':
    app.run(debug=True)
