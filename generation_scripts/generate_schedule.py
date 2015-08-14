'''
Generate schedule and place into javascript array

This script is run once to generate full season schedule
The print statements generated here should be written to a javascript file to be used in the app
Thus this script is not needed for the app itself - script added just to show how I got the data on the client side
'''

import requests, json, csv

team_code_and_name = {} # MUFC -> Manchester United FC amd Manchester United FC -> MUFC
full_schedule = {} # key here is matchday -> 1 to 38
team_locations = {} # team code to [lat, long]


def generate_team_names_codes():
	teams_url = "http://api.football-data.org/alpha/soccerseasons/398/teams"

	teams_data = requests.get(teams_url).json()['teams'] # array of 20 teams

	for team in teams_data:
		full_name = team['name']
		team_code = team['code']
		team_code_and_name[full_name] = team_code
		team_code_and_name[team_code] = full_name

def initiate_full_schedule():
	for i in  range(1, 39):
		full_schedule[i] = []

def generate_full_schedule():
	initiate_full_schedule()

	all_fixtures_url = "http://api.football-data.org/alpha/soccerseasons/398/fixtures"

	all_fixtures = requests.get(all_fixtures_url).json()['fixtures'] # 380 total fixtures

	for fixture in all_fixtures:
		homeTeamName = fixture['homeTeamName'] # full team name here - 'Manchester United FC', for example
		awayTeamName = fixture['awayTeamName']
		matchday = fixture['matchday'] # 1-38 (38 total weeks, each week has 10 matches)
		date = fixture['date']

		homeTeamCode = team_code_and_name[homeTeamName]
		team_locations[homeTeamName] = [] # populate empty for now
		awayTeamCode = team_code_and_name[awayTeamName]

		match = [homeTeamCode, awayTeamCode, date] # stick to this format to avoid mismatching
		full_schedule[matchday].append(match)

def generate_team_locations():
	with open('../data/stadiums-with-GPS-coordinates.csv') as csvfile:
		reader = csv.DictReader(csvfile)
		for row in reader:
			teamName = row['Team'] + 'FC' # data has all team names end in space
			latLng = [row['Latitude'], row['Longitude']]

			if teamName in team_locations:
				team_locations[teamName] = latLng

	team_locations['AFC Bournemouth'] = [50.7354339, -1.838764] # special case - not added in csv file


# javascript formatted print statements
def print_formatted_team_names_and_codes():
	print('var team_code_and_name = {}')

	for key in team_code_and_name:
		print('team_code_and_name[\'{0}\'] = \'{1}\''.format(key, team_code_and_name[key]))

def print_full_schedule():
	print('var full_schedule_by_matchday = {}')

	print('// home team listed first')
	for matchday in full_schedule:
		print('full_schedule_by_matchday[\'{0}\'] = {1}'.format(matchday, full_schedule[matchday]))

# team code to lat lng location
def print_team_locations():
	print('var team_code_to_locations = {}')

	for name in team_locations:
		latLng = team_locations[name]
		print('team_code_to_locations[\'{0}\'] = [{1}, {2}]'.format(team_code_and_name[name], latLng[0], latLng[1]))



generate_team_names_codes()
generate_full_schedule()
generate_team_locations()

print_formatted_team_names_and_codes()
print_full_schedule()
print_team_locations()