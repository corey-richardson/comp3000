Archery clubs are volunteer-led. With the traditional pen and paper or Excel spreadsheet method of managing scores and memberships, club Records Officers can spend hours staring at handicap tables and cross-referencing values against classification tables. 

This system automates the process, performing domain-specific calculations and returning the results instantly to the archer.

Club Secretaries and Tournament Officers can manage their members' emergency contact information, keeping their archers safe at and away from the club. 

Integrated journals allow Coaches to track archers' progress via qualitative written notes and quantitative data metrics.

<show container diagram>

The system was built using the PERN stack. The frontend is a React application which uses React Context API-managed JWT authentication. 

This communicates with an Express.js backend API, which interacts with a PostgreSQL database using the Prisma ORM to ensure type-safe data flow.

Additionally, there is a Python Flask microservice used by the system to perform the domain-specific logic; classification and handicap calculations

<show AWS digram>

The system is deployed on Amazon Web Services.

All traffic is routed through CloudFront which depending on the path will serve frontend content or allow the backend API to be consumed by the request.

The frontend is built into static files, and stored in an S3 bucket.

An Application Load Balancer routes backend traffic to the Express.js and Flask service tasks, sitting on an ECS cluster which spans across three availability zones to ensure high availabilty.

<demonstrate signing up>

On the live system, I will start by signing up as a new user. The default page for signed in users is the Dashboard page, providing an overview of all information that may be relevant to an archer.

<update user details, 12345>

From here, I can update my user information, such as setting my accounts "default bowstyle" entering my unqiue Archery GB Membership number.

From this page I can also add or update my Emergency Contact information, which is accessible only by club administrators and captains, helping me to stay safe at club shoots and external events.

<invites>

The membership number is what will be used to link an invite received from a club to my account.

<submit score>

One of the main functionalities of this system for a standard archer will be the score submission and calculation service.

The score submission form will only accept round name values from a datalist returned by the Flask service to ensure that data doesnt get polluted.

The service immeadiately returns the outcome of the classification, showing me both the uncapped classification level, representing performance, and the capped classification level which follows the shoot-status requirements in line with Archery GB rules.

If I now submit a second score using the same bowstyle, the Records Summary Service can begin to work, showing me that I have scored enough arrows at an archer classification level to achieve this award. To be awarded with a handicap, I will need to submit a third score like so. 

<show submitted score with journal>

As this user account holds a coach role in the club, I can see other users scores, including the notes *and* journals sections which would allow me to track the performances of archers I am coaching.

<send invite 67890>

As an administrator, I have access to the Invite system. 

This allows me to add new members to the digital club, ensuring that only verified archers with authorised roles can access sensitive club data.

This directly addresses the Legal and Ethical requirements from my projects analysis by ensuring data privacy through the Principle of Least Privilege.

<login as 67890>

Now, I’ll log in as a different user whose membership number is '67890'. 

<invites> <show no access to club page>

To demonstrate the Role Based Access Controls, you can see that after accepting an invite to this club, I cannot access the club management page to access the sensitive data or scores submitted by other archers.

<return to main profile, demonstrate score filtering>

Even as a standard member, I have access to useful tools. I can use score filtering to track my progress over the season, looking at specific bowstyles; a feature which could be used by club officers handling their teams monthly postal league entries to filter scores by a given time-period, bowstyle, age category, and more.

---

The project successfully consolidated aspects from different modules as part of my Software Engineering degree, and from outside learning: from a complex cloud-hosted infrastructure and microservice communication, to front-end state management, all validated through unit tests with a high code-coverage metric, and DevOps CI/CD pipelines following a shift-left approach to ensure that bad code can't reach the production environment.
