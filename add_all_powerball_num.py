import requests
from bs4 import BeautifulSoup
import settings

# connect to cluster and creates dblottery_powerball collections if not exist
from pymongo import MongoClient
client = MongoClient(settings.mongodb_cluster)
db = client.dblottery_powerball

# makes scraping look like an user
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get(settings.url_powerball,headers=headers)
soup = BeautifulSoup(data.text, 'html.parser') # use html.parser

collected_datas = []
lottery_datas = soup.select('#content > div > div > table > tbody > tr')
for lottery_data in lottery_datas:
    # collect draw date, 5 winning numbers, 1 power ball number, jackpot price
    draw_date = lottery_data.select_one('td:nth-child(1)')
    winning_numbers = lottery_data.select_one('td:nth-child(2)')
    extra_number = lottery_data.select_one('td:nth-child(3)')
    if draw_date is not None and winning_numbers is not None and extra_number is not None:
        doc = {
            'draw_date' : draw_date.text,
            'winning_numbers' : ",".join(winning_numbers.text.split(' - ')),
            'extra_number' : extra_number.text,
        }
        collected_datas.append(doc)
collected_datas = collected_datas[::-1]
for collected_data in collected_datas:
    db.lottery_numbers.insert_one(collected_data) # insert json format data to mongoDB


## USE THIS TO GET JACKPOT PRICES ##
# jackpot = lottery_data.select_one('td:nth-child(5)')
# if draw_date is not None and winning_numbers is not None and extra_number is not None and jackpot is not None:
#     if 'Million' in jackpot.text: # get Million dollar jackpot
#         doc = {
#             'draw_date' : draw_date.text,
#             'winning_numbers' : ",".join(winning_numbers.text.split(' - ')),
#             'extra_number' : extra_number.text,
#             'jackpot' : jackpot.text[1:].split(' ')[0]
#         }
#     else: # get Billion dollar jackpot
#         doc = {
#             'draw_date' : draw_date.text,
#             'winning_numbers' : ",".join(winning_numbers.text.split(' - ')),
#             'extra_number' : extra_number.text,
#             'jackpot' : str(int(float(jackpot.text[1:].split(' ')[0]) *1000))
#         }
