'''
This script is called once to fetch all 20 team svgs and save them to a folder_to_save

Only used to prep the project with team images
'''

import requests
import urllib.request
import shutil

all_teams_url = 'http://api.football-data.org/alpha/soccerseasons/398/teams'

folder_to_save = '../images/team_icons_svg/'

def generate_team_names_codes():
	teams_url = "http://api.football-data.org/alpha/soccerseasons/398/teams"

	teams_data = requests.get(teams_url).json()['teams'] # array of 20 teams

	for team in teams_data:
		fullName = team['name']
		teamCode = team['code']
		crestUrl = team['crestUrl']

		fileDestination = folder_to_save + teamCode + ".svg"

		print("Downloading {0} crest from {1} to {2}...".format(fullName, crestUrl, fileDestination))

		with urllib.request.urlopen(crestUrl) as response, open(fileDestination, 'wb') as out_file:
			shutil.copyfileobj(response, out_file)




generate_team_names_codes()