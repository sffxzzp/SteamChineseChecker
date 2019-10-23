#!/bin/python3
# -*- coding: UTF-8 -*-
import json, urllib, requests
from bs4 import BeautifulSoup

def main():
	oricount = len(json.loads(open('data.json', 'r', encoding='utf-8').read()))
	maxcount = json.loads(requests.get('https://store.steampowered.com/curator/31318556/ajaxgetfilteredrecommendations/render/?query=&start=0&count=0&tagids=&sort=recent&app_types=&curations=&reset=false').text)['total_count']
	print('Old data: %s\tNew Data: %s' % (oricount, maxcount))
	if maxcount > oricount:
		cont = json.loads(requests.get('https://store.steampowered.com/curator/31318556/ajaxgetfilteredrecommendations/render/?query=&start=0&count=%s&tagids=&sort=recent&app_types=&curations=&reset=false' % maxcount).text)['results_html']
		soup = BeautifulSoup(cont, 'html.parser')
		out = {}
		for game in soup.select('div.recommendation'):
			appid = game.select_one('a.store_capsule').get('data-ds-appid')
			desc = game.select_one('div.recommendation_desc').text.replace('"', '').strip()
			link = game.select_one('div.recommendation_readmore > a[target=_blank]')
			if link == None:
				link = ''
			else:
				link = link.get('href').replace('https://steamcommunity.com/linkfilter/?url=', '')
				if 'steamcn.com' in link:
					link = link.replace('steamcn.com', 'keylol.com')
			out[appid] = {'description': desc, 'link': link}
		outstr = json.dumps(out, ensure_ascii=False)
		open('data.json', 'w', encoding='utf-8').write(outstr)

if __name__ == '__main__':
	main()