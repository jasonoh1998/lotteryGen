# Lottery Generator

Lottery Generator creates lottery numbers for powerball(United States) and lotto645(South Korea).
It used past data of these lottery, and your lucky numbers based on your name and birthday to produce winning number for you.

## Preview
[Daily Unique Lottery.webm](https://user-images.githubusercontent.com/92873161/231677028-23f5801d-d2bb-4ec6-84db-3bad776b72db.webm)

## Frameworks

Used flask, mongodb atlas. Static html page, bootstrap and vanilla js, jQuery are used.

## Installation Guide

1. You will need to create an account at MongoDB atlas.

2. Change .env.example to .env and follow instruction.

3. You should set up virtual environment for python if you have not. Then run,
```bash
pip install flask, pymongo, requests, dnspython, beautifulsoup4
```

4. run add_all_lotto645_num.py and add_all_powerball_num.py

This will let you try the code only using the data from webscraping. You will need data.json to run the full version, which I am not uploading here.
Also, you can run the flask server either local or on cloud service like AWS. This will update the lottery database inside your mongoDB atlas every 12 hours. UI will support upto screen with 2000px.
