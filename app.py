#create an enviornment variable

import schedule
import settings
import update_lottery

from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def home():
   return render_template('index.html')

if __name__ == '__main__':
   app.run('0.0.0.0', port=5000, debug=True)

# update recent lottery numbers every 12 hours
schedule.every(12).hours.do(update_lottery.powerball_update())
schedule.every(12).hours.do(update_lottery.lotto645_update())

from pymongo import MongoClient
client = MongoClient(settings.mongodb_cluster)
db = client.dblottery_powerball
db = client.dblottery_lotto645
