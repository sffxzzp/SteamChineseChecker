#!/bin/python3
# -*- coding: UTF-8 -*-
import json, urllib, requests, math, time
from bs4 import BeautifulSoup

def main():
	oricount = len(json.loads(open('data.json', 'r', encoding='utf-8').read()))
	maxcount = json.loads(requests.get('https://store.steampowered.com/curator/31318556/ajaxgetfilteredrecommendations/render/?query=&start=0&count=0&tagids=&sort=recent&app_types=&curations=&reset=false').text)['total_count']
	print('Old data: %s\tNew Data: %s' % (oricount, maxcount))
	out = {}
	for page in range(0, math.ceil(maxcount / 500)):
		cont = json.loads(requests.get('https://store.steampowered.com/curator/31318556/ajaxgetfilteredrecommendations/render/?query=&start=%s&count=%s&tagids=&sort=recent&app_types=&curations=&reset=false' % (500*page, 500)).text)['results_html']
		soup = BeautifulSoup(cont, 'html.parser')
		for game in soup.select('div.recommendation'):
			appid = game.select_one('a.store_capsule').get('data-ds-appid')
			desc = game.select_one('div.recommendation_desc').text.replace('"', '').strip()
			link = game.select_one('div.recommendation_readmore > a[target=_blank]')
			if link == None:
				link = ''
			else:
				link = urllib.parse.unquote(link.get('href').replace('https://steamcommunity.com/linkfilter/?url=', '').replace('https://steamcommunity.com/linkfilter/?u=', ''))
				if 'steamcn.com' in link:
					link = link.replace('steamcn.com', 'keylol.com')
			out[appid] = {'description': desc, 'link': link}
	outstr = json.dumps(out, ensure_ascii=False)
	open('data.json', 'w', encoding='utf-8').write(outstr)

	applistdata = json.loads(requests.get('https://api.steampowered.com/ISteamApps/GetAppList/v0002/').text)['applist']['apps']
	applist = {}
	for item in applistdata:
		applist[str(item['appid'])] = item['name']
	outhtml = "<html><body>"
	for appid in out:
		if appid not in applist:
			continue
		linkhtml = ""
		if out[appid]['link'] != "":
			linkhtml = "<a href='"+out[appid]['link']+"' target='blank'>汉化链接</a><br>"
		outhtml += "<a href='https://store.steampowered.com/app/" + appid + "/' target='_blank'>" + applist[appid] + "</a><br>"+out[appid]['description']+"<br>"+linkhtml+"<br>"
		out[appid]['name'] = applist[appid]
	outhtml += "</body></html>"
	open('output.html', 'w', encoding='utf-8').write(outhtml)

	open('update.txt', 'w', encoding='utf-8').write(str(int(time.time())))

if __name__ == '__main__':
	main()
