import requests
from bs4 import BeautifulSoup
import settings

# connect to cluster and creates dblottery_powerball collections if not exist
from pymongo import MongoClient
client = MongoClient(settings.mongodb_cluster)
db = client.dblottery_lotto645

# makes scraping look like an user
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}

data = requests.get(settings.lotto645_pageNum(1),headers=headers) # go to first page to get overall page numbers
soup = BeautifulSoup(data.text, 'html.parser') # use html.parser

pageLength = soup.select('#page-wrapper > div.row.sm-row-fix.history-summary-view > div > div.pull-right.top-pager')
pageLength = int(pageLength[0].text.replace('1 / ','')) # get total page numbers to use it in for loop

collected_datas = []
# gets up to 266 round when 1038 round was most recent
for pageNum in range(1, pageLength+1):
    data = requests.get(settings.lotto645_pageNum(pageNum),headers=headers) # go to first page to get overall page numbers
    soup = BeautifulSoup(data.text, 'html.parser') # use html.parser
    lottery_datas = soup.select('#summary-table > tbody > tr')
    for lottery_data in lottery_datas:
        lotto645_data = lottery_data.text.strip().replace(' ','').split('\n')
        draw_date = lotto645_data[1]
        winning_numbers = lotto645_data[2]
        extra_number = lotto645_data[3]
        doc = {
            'draw_date' : draw_date,
            'winning_numbers' : winning_numbers,
            'extra_number' : extra_number,
        }
        collected_datas.append(doc)
collected_datas = collected_datas[::-1]
for collected_data in collected_datas:
    db.lottery_numbers.insert_one(collected_data) # insert json format data to mongoDB
