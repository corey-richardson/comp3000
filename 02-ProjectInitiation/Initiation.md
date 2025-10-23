# 02. Project Initiation Document

## Project Title

Archery Scorekeeper and Club Management

## Supervisor

Dr Vassilis Cutsuridis

## Programme Enrollement

BSc Computer Science (Software Engineering)

## Keywords

Archery Scorekeeper and Club Management

Fullstack, Full Stack, Web Development

TypeScript, Next.js, Supabase, React, Node.js

Postgres, Prisma

Docker, Containers, Containerisation

Python, Flask, archeryutils

## Project Vision

> Outline project vision here. Setting out your project vision at the start does not set it in stone, it can change as you develop your ideas but you must provide a starting point.
> 
> For [who?] <br>
> Whose [problem] <br>
> The [name of your product] <br>
> Is a [Type of product] <br>
> That [what are the key reasons] <br>

The system will be for archery club committee officers and members, providing interfaces for score/record management and member management. 

The previous process for score recording at the University of Plymouth's Archery Club is to manually collect scores and scoresheets on paper, and transfer this information over into an Microsoft Excel spreadsheet before performing lookups for classification and handicap levels; a time consuming, labourious, and error-prone process.

The Archery Scorekeeper and Club Management system (working title) is a online score and club management system that makes the process of archery club Records Officers colelcting scores from their club members and processing the data simpler than traditional methods.

The project has a unique selling proposition within a highly specific niche, remaining different from established, close-sourced, commercial platforms such as Golden Records or archr.net due to the open-source nature of the project, especially with a planned technology stack of Next.js (MIT License), Supabase (Apache 2.0 License) and Flask (BSD-3-Clause License) - a fully open-sourced technology stack.

### Functional Requirements of the Project

Score entry
- Offer a way for archers to submit their scores to the system for standard rounds.
- These scores are then accessible by a Records Officer of a club they are associated with for processing.
- Could potentially offer a way of bulk importing scores (CSV, JSON, XML?) for legacy data and data migrations.

Classification and Handicap Computation
- Calculate the classification and handiap level of scores recorded and feed this back to the member.
- Python PIP package exists for this task: Python container in project? Docker

Club and Personal Records
- Members should be able to see high scores.
- Records Officers should be able to verify and approve new club records.

Competition and Postal League support
- Scores should be filterable by round type and timeframe to be used in events such as postal leagues such as DCAS Winter Postal League, Virtual SWWU Legs or UKSAA E-League.
- This allows the Captain to submit club scores to these events with ease.

Scoresheet Uploading
- Scoresheets should be able to be uploaded alongside recorded scores.
- Countersigned (witnessed) scoresheets are a requirement for Bowman and above classification levels.

### Non-Functional Requirements of the Project

The project should be accessible in line with WCAG standards, and usable by technical and non-technical users.

Any data stored should be secure, and only accessbile by users with a relevant role-based access level.

The project should be deployed using Docker and containerisation, to assist with maintainability and extensibility.

The codebase should be entirely open-source!

## Legal, Social, Ethical and Professional Considerations

### Legal

The system will store Personally Identifiable Information (PII). As such, this data will have to be carefully handled and protected.

The General Data Protection Regulation (GDPR) and Data Protection Act 2018 (DPA) will be the primary principles to follow.
- Only collect the minimal amount of data required to perform the processes necessary to a role
- There must be a legitimate basis for processing user data
- The system must provide a simple way for a user to read, update or (request to) delete their data

The system will use an open-sourced techstack. Adhererance to license requirements will be needed (MIT, Apache 2.0, BSD-3-Clause) in the implementation and documentation.

### Social

The system should motivate people to participate and be encouraging! Displaying scores to other members of the club (outside of the committee requirements) should be defaulted to private.

As the system is replacing a paper/spreadsheet process, there should be considerations into allowing non-technical members without internet access an alternative way to submit scores. For example, the Records Officer should be able to submit scores and enter data for them.

### Ethical

There is a requirement for scores achieving a Bowmen level or above classification to be submitted alongside a countersigned scoresheet. They must also be shot under "competitive conditions", such as a Club Target Day, Club Competition, or Open Competition. To ensure competitive fairness, an uploaded scoresheet or a link to an IANSEO page should be a requirement to assign this level to a score record. Records Officer approval should be required before a classification is confirmed.

As the system will be using the `archeryutils` library to handle handicap and classification calculations, these calculations should be verifiable by a Records Officer and approved (at least above the Bowmen level of classification). Resources detailing how the calculations work could be useful for transparency, rather than a "black box".

A members shooting history should only be visible on a need-to-know basis' Role Based Access Controls.

As I hold a 'position of authority' (Chair, Records Officer) at the UoP Archery Club, I will have to check the ethical considerations of getting members of the club to be testers for the project. This adds risk! 

### Professional

Classification and handicap calculations should be tested and validated to confirm accurate reporting (Vitest?) before they are trusted.

As the code will be open-sourced, it should be well documented (Swagger UI, JS Docs) to allow future developers to build upon the solution for their needs.

## Risk Management Plan

Learning Time Overrun
Whilst I have some familiarity with some of the frameworks planned to be used in the techstack for this project, there is some learning I will have to do around Supabase. There is risk that learning this framework takes longer than expected which would delay the start of the project.
Mitigation of this would be to ensure the MVP follows a strict-scope, only implementing core functionality at first and adding more advanced features later in development. Possible risk of integration issues if not wholly planned?

Potential conflict in finding test users
As I hold a 'position of authority' (Chair, Records Officer) at the UoP Archery Club, I will have to check the ethical considerations of getting members of the club to be testers for the project. Confirm this with supervisor, alternatively MD would know as COMP2005/COMP3006 module lead.

Dependency Management
I plan to use the `archeryutils` library to handle classification and handicap calculations. There is risk that this library is updated in a way that changes the way the library API is consumed, breaking calculation logic in the Flask container.
To mitigate this, the use of a Dockerfile or `requirements.txt` file specifying a known and tested version of the dependency should be used. If the library gets updated, it will not impact the project (the library was recently updated to version 2.0.0!). Encapsulating how the API is consumed would also minimise any refactors required in the Flask container if there was an update. Unit and Integration Tests should verify the outputs of this library.