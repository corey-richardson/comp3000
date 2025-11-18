User
- id
- Name
- ArcheryGB Membership Number, unique
- Default Bowstyle
- Sex
- Year of Birth
- created_at
- updated_at
- archived_at

Club
- id
- Name, unique
- created_at

Club Membership (Link table)
- id
- user_id
- club_id
- Roles[]
- joined_at, now()
- left_at

Invite
- id
- club_id
- user_id?
- membershipNumber?
- invitedBy
- status
- created_at
- accepted_at?
- declined_at?

Emergency Contact
- id
- user_id
- Name
- Phone
- Email
- RelationshipType
- updated_at

Score
- id
- user_id
- dateShot
- roundName
- venue
- bowstyle
- score
- xs
- tens
- nines
- competitionStatus
- sex
- ageCategory
- notes
- journal
- roundIndoorClassification
- roundOutdoorClassification
- roundHandicap
- submitted_at
- processed_at
- updated_at
- scoresheet_id

Scoresheet
- id
- file_url
- uploaded_at
- uploaded_by

RecordsSummary
- user_id pk
- indoorClassification
- indoorBadgeGiven
- indoorHandicap
- outdoorClassification
- outdoorBadgeGiven
- outdoorHandicap
- notes
