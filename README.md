## Development Fixtures

The default state of the database after loading the "devsetup.json" fixture should be as follows:

Users:
- \{username: admin, password: password\} -- is superuser
- \{username: user, password: CorrectHorseBatteryStaple\} -- is regular user

Profiles:
- \{user: \(admin\), teams: \[\(team1\)\]\}
- \{user: \(user\), teams: \[\(team2\)\]\}

Events:
- \{name: event, starts: May 26, 2026, ends: May 26, 2027\}

Teams:
- \{name: team1, event: event\}
- \{name: team2, event: event\}
