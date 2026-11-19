from pytrends.request import TrendReq

pytrends = TrendReq(hl='en-US', tz=330)

keyword = "Python"

pytrends.build_payload([keyword], timeframe='today 3-m')

data = pytrends.interest_over_time()

print(data.head())