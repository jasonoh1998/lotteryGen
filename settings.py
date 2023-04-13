from dotenv import load_dotenv
load_dotenv()
import os
mongodb_cluster = os.getenv("MONGODB_ACCESS")

url_powerball = 'https://www.texaslottery.com/export/sites/lottery/Games/Powerball/Winning_Numbers/index.html_2013354932.html'

def lotto645_pageNum(pageNum):
    return 'https://en.lottolyzer.com/history/south-korea/6_slash_45-lotto/page/'+str(pageNum)+'/per-page/50/summary-view'