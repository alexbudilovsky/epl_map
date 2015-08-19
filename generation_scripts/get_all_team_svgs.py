'''
This script is called once to fetch all 20 team svgs and save them to a folder_to_save

Only used to prep the project with team images
'''

import requests
import urllib.request
import shutil
import sys
from xml.dom import minidom

all_teams_url = 'http://api.football-data.org/alpha/soccerseasons/398/teams'

folder_to_save = '../images/team_icons_svg/'
skip_SVG_download = False # if arg 'skip_svg_download' passed, only file sizes will be generated from present svg files

def generate_team_names_codes():
	teams_url = "http://api.football-data.org/alpha/soccerseasons/398/teams"

	teams_data = requests.get(teams_url).json()['teams'] # array of 20 teams

	for team in teams_data:
		fullName = team['name']
		teamCode = team['code']
		crestUrl = team['crestUrl']

		fileDestination = folder_to_save + teamCode + ".svg"

		if (skip_SVG_download is False):
			print("Downloading {0} crest from {1} to {2}...".format(fullName, crestUrl, fileDestination))

			# two special cases: football-data.org provides png files for these two teams
			if (teamCode == 'CRY'):
				crestUrl = 'https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg'

			if (teamCode == 'LCFC'):
				crestUrl = 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg'

			with urllib.request.urlopen(crestUrl) as response, open(fileDestination, 'wb') as out_file:
				shutil.copyfileobj(response, out_file)

		svgFile = open(fileDestination, 'r')
		xmlDoc = minidom.parse(svgFile)
		svgFile.close()

		print("Parsing " + fileDestination + " XML for width/height ...")
		svgTag = xmlDoc.getElementsByTagName('svg')[0]
		width  = ''.join(c for c in str(svgTag.getAttribute('width'))  if (c.isdigit() or c == '.'))
		height = ''.join(c for c in str(svgTag.getAttribute('height')) if (c.isdigit() or c == '.'))
		
		print("w: " + width)
		print("h: " + height)



if len(sys.argv) > 1:
	if (sys.argv[1].lower() == 'skip_svg_download'):
		skip_SVG_download = True

generate_team_names_codes()