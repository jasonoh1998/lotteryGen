import requests
from bs4 import BeautifulSoup
import settings
# connect to dblottery_powerball collections
from pymongo import MongoClient
client = MongoClient(settings.mongodb_cluster)

def powerball_update(iteration=5):
    counter = 0 # counter will break after 5 iteration
    iteration = iteration
    db = client.dblottery_powerball
    changed_values = []
    db_first_five = list(db.lottery_numbers.find({}, {'_id':False}).limit(iteration)) # finds iteration amount of numbers from database
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(settings.url_powerball,headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser') # use html.parser
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
            if doc not in db_first_five:
                changed_values.append(doc)
            counter += 1
            if(counter == iteration): break
    changed_values = sorted(changed_values,key=lambda i: i['draw_date'])
    if(changed_values != []):
        if(len(changed_values) >= 100):
            print("Too many changes. Should run add_all python files or manually input changed values.")
        elif(len(changed_values)==iteration):
            powerball_update(iteration+10) # search 10 more until it find all changed values
        else:
            for changed_value in changed_values:
                db.lottery_numbers.insert_one(changed_value) # insert json format data to mongoDB
    else:
        print("No changes. Up to date.")

def lotto645_update(iteration=5):
    counter = 0 # counter will break after 5 iteration
    iteration = iteration
    db = client.dblottery_lotto645
    changed_values = []
    db_first_five = list(db.lottery_numbers.find({}, {'_id':False}).sort([{'_id',-1}]).limit(iteration)) # finds iteration amount of numbers from database
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(settings.lotto645_pageNum(1),headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser') # use html.parser
    lottery_datas = soup.select('#summary-table > tbody > tr')
    for lottery_data in lottery_datas:
        # collect draw date, 5 winning numbers, 1 power ball number, jackpot price
        lotto645_data = lottery_data.text.strip().replace(' ','').split('\n')
        draw_date = lotto645_data[1]
        winning_numbers = lotto645_data[2]
        extra_number = lotto645_data[3]
        doc = {
            'draw_date' : draw_date,
            'winning_numbers' : winning_numbers,
            'extra_number' : extra_number,
        }
        if doc not in db_first_five:
            changed_values.append(doc)
        counter += 1
        if(counter == iteration): break
    changed_values = sorted(changed_values,key=lambda i: i['draw_date'])
    if(changed_values != []):
        if(len(changed_values) >= 45):
            print("Too many changes. Should run add_all python files or manually input changed values.")
        elif(len(changed_values)==iteration):
            powerball_update(iteration+5) # search 5 more until it find all changed values
        else:
            for changed_value in changed_values:
                db.lottery_numbers.insert_one(changed_value) # insert json format data to mongoDB
    else:
        print("No changes. Up to date.")
