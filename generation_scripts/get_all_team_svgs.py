'''
This script is called once to fetch all 20 team svgs and save them to a folder_to_save

Only used to prep the project with team images

Also determines sizes of all svg crests and saves them in javascript
Pass 'skip_svg_download' as arg1 to only do size analysis
'''

import requests
import urllib.request
import shutil
import sys
from xml.dom import minidom

all_teams_url = 'http://api.football-data.org/alpha/soccerseasons/398/teams'

folder_to_save = '../images/team_icons_svg/'
skip_SVG_download = False # if arg 'skip_svg_download' passed, only file sizes will be generated from present svg files

team_svg_size_file = '../browser_scripts/team_svg_sizes.js'

def generate_team_names_codes():
	teams_url = "http://api.football-data.org/alpha/soccerseasons/398/teams"

	teams_data = requests.get(teams_url).json()['teams'] # array of 20 teams

	print("Writing crest SVG width/height to {0}".format(team_svg_size_file))
	target_size_file = open(team_svg_size_file, 'w')
	target_size_file.write('// teamCode -> [width, height] (in pixels)\n')
	target_size_file.write('var team_crest_svg_size = {}')

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

		svgTag = xmlDoc.getElementsByTagName('svg')[0]
		width  = ''.join(c for c in str(svgTag.getAttribute('width'))  if (c.isdigit() or c == '.'))
		height = ''.join(c for c in str(svgTag.getAttribute('height')) if (c.isdigit() or c == '.'))
		
		crestSizeLine = 'team_crest_svg_size[\'{0}\'] = [{1}, {2}]'.format(teamCode, width, height)
		print("Writing " + crestSizeLine + " to file")
		target_size_file.write("\n" + crestSizeLine)

	target_size_file.close()


if len(sys.argv) > 1:
	if (sys.argv[1].lower() == 'skip_svg_download'):
		skip_SVG_download = True

generate_team_names_codes()