# COMP3000 Project Proposal

| Project Title |
| :---: |
| Archery Scorekeeper for Records and Club Management |

## Project Aims

To design and produce an online system that will assist archery club committee officers in managing scores submitted by the club members, and handling classification level and handicap computation. 

## Background and Archery-based Context

### Standard Rounds

There are a standardised set of target archery "rounds"[$^\text{[Beginners Series: Part 1 – Rounds]}$](#beginners-series-part-1--rounds), describing how many arrows are shot at what distance at what target face size. National and international governing bodies, such as Archery GB and World Archery, define these rounds as well as the associated classification and handicap systems that go with them.

> "A round is really just a well-defined code name for a certain combination of a number of arrows shot at a particular set of distances on specific target faces." [$^\text{[Beginners Series: Part 1 – Rounds]}$](#beginners-series-part-1--rounds)

### Classification and Handicap Performance Metrics

Classifications and Handicaps (like in golf), reflect an archers performance level relative to a national benchmark. 

Handicaps represent the angular spread of arrows shot as a normal distribution, indicating the probability that an arrow will land on a certain point of a target face, a system originally developed by David Lane between 1978 and 1979, and updated by Jack Atkinson more recently in 2020.

> "Within archery there exists a handicap system that allows any quantity of arrows shot at any distance to be given a rating that reflects how good the performance was. This rating depends only on an archer's accuracy i.e. their ability to shoot a tight group." [$^\text{[The Archery Handicap System]}$](#the-archery-handicap-system)

<div style="page-break-after: always;"></div>

> "We start by considering the perfect archer. Every arrow they shoot follows the exact same trajectory straight to the x. This means that the arrow always leaves the bow in exactly the same way, at the same height, angle, and speed. In real terms they have perfectly repeatable technique every shot, and can hold perfectly steady on the gold when aiming."
>
> !["The perfect archer" Diagram](https://jackatkinson.net/post/images/handicap_perfect.png)
>
> "Now consider the reality. There will be some slight variation in technique from shot to shot, and variation of the point of release as the sight floats during the aiming process. As a result each arrow will follow a slightly different path to the target, spread around the perfect trajectory illustrated above. This is illustrated below where the archer is still shooting a good group, but with some variation."
>
> !["The imperfect archer" Diagram](https://jackatkinson.net/post/images/handicap_imperfect.png)
> "The spread of these arrows can be described by an angle that contains all of the trajectories at the point at which they leave the bow. This is shown by the blue triangle in the above image, with the angle labelled ‘x’. The smaller this angle, the tighter the group will be at the target. At the most fundamental level, this angle is the archer’s handicap."
>
> [$^\text{[The Archery Handicap System]}$](#the-archery-handicap-system)

<div style="page-break-after: always;"></div>

The width of this normal distribution represents the archers handicap; the size of their average grouping. The lower the handicap, the smaller the standard deviation.

> "The image on the left below shows a high handicap archer who typically hits the target face, with the occasional miss. On the right is the distribution of a more skilled archer who groups in the gold, with the occasional arrow out into the red."
>
> ![](https://jackatkinson.net/post/images/handicaps_24.jpg)
>
> [$^\text{[The Archery Handicap System]}$](#the-archery-handicap-system)

Handicaps can be used to compare scores shot of different standard rounds. This can be used for benchmarking performance, as it allows you to know what score you "should" get on the *WA 18m* standard round based on a known score for a *Portsmouth* standard round.

<div style="page-break-after: always;"></div>

![Round Comparison](round-comparison.png)

They are also useful for benchmarking changes to equipment or technique by seeing how your scores and handicaps change as you make changes.

Based from these handicaps, "classification levels" can be calculated as shown below.

![Setting the scores](https://jackatkinson.net/post/images/new_outdoor_classifications.svg)

> [$^\text{[The New Outdoor Classification Scheme for Target Archery]}$](#the-new-outdoor-classification-scheme-for-target-archery)

Archery GB provides a classification scheme as described in SAP7 of the Shooting Administrative Procedures. There are different schemes for different disciplines of archery, but each seeks to provide a progression scheme to reward archers performance as they improve.

For outdoor target shooting there are three tiers: Archer, Bowman, and Master Bowman, each with 3 subdivisions.

For indoor target shooting there are, again, three tiers: Archer, Bowman, and Master Bowman, this time with 8 different classifications available (no Elite Master Bowman indoors).

Classification lookup tables can be found on the Archery Geekery website. [$^\text{[Mobile Friendly Classification Tables]}$](#archery-geekery-mobile-friendly-classification-tables)

<div style="page-break-after: always;"></div>

### Common Club Committee Roles

Since the system will use role-based access levels to handle Personally Identifiable Information (PII), I will explain some of the Committee Officer roles relevant to the system.

The four roles the system will use will be:
- Admin (this covers anyone needing full access to PII to perform the responsibilities of their role, such as a Club Chair, Secretary or Membership Secretary)
- Captain or Tournaments Organiser (this role will have access to *some* PII, such as Archery GB membership number and records shot for submission into postal leagues)
- Records Officers (this role has limited access to PII, overseeing score records and calculating handicap and classification levels as described above).
- Member

[$^\text{[Yelverton Bowmen Committee Structure]}$](#yelverton-bowmen-committee)

<div style="page-break-after: always;"></div>

## Functional Requirements of the Project

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

## Non-Functional Requirements of the Project

The project should be accessible in line with WCAG standards, and usable by technical and non-technical users.

Any data stored should be secure, and only accessbile by users with a relevant role-based access level.

<div style="page-break-after: always;"></div>

## Technical Considerations

### Containerisation

To allow for scalability, containers could be used. This would also support the use of the `archeryutils` Python package for handling classification and handicap calculations.

![](Containers.svg)

<div style="page-break-after: always;"></div>

### Tech Stack and Framework

Due to my prior familiarity, Node.js, Next.js, React using JavaScript/TypeScript should be used where appropriate. A comparison of Postgres using Prisma ORM and MongoDB will need to be undertaken to evaluate suitability; MondgoDB (MERN) is being covered in COMP3006 Full Stack Development.

**Supabase should be researched. **
- It provides an integrated REST API layer for database communication. 
- It supports Role-Based Access Control security polices at the row-level, ensuring that only roles with the appropriate access levels can view data relevant to their roles. 
- It offers built-in authentication including email-password based authentication AND OAuth SSO. 
- It features an object storage service which could be used to store submitted user scoresheets.
- It can be containerised and deployed alongside a Flask backend (for `archeryutils` package)
- It integrates well with a React/Next.js frontend!

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### CI/CD

![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

- GitHub Actions
- Swagger UI (JSDoc)
- Vitest
- ESLint
- Husky

<div style="page-break-after: always;"></div>

## References

#### Beginners Series: Part 1 – Rounds

Archery Geekery. (2023). Beginners Series: Part 1 – Rounds. [online] Available at: https://archerygeekery.co.uk/2023/06/08/beginners-series-part-1-rounds/

#### The Archery Handicap System

Atkinson, J. (2020). The Archery Handicap System. [online] Available at: https://jackatkinson.net/post/archery_handicap/.

#### The Archery Handicap System Revisited

Atkinson, J. (2021). The Archery Handicap System Revisited. [online] Available at: https://jackatkinson.net/post/archery_handicaps_revisited/.


#### The New Outdoor Classification Scheme for Target Archery

Atkinson, J. (2023). The New Outdoor Classification Scheme for Target Archery. [online] Available at: https://jackatkinson.net/post/archery_outdoor_classification/.

#### Archery Geekery Mobile Friendly Classification Tables

Archery Geekery. Mobile Friendly Classification Tables. [online] Available at: https://archerygeekery.co.uk/mobile-friendly-classification-tables/.

#### Yelverton Bowmen Committee

Yelverton Bowmen. Committee. [online] Available at: https://yelvertonbowmen.co.uk/committee/.

#### archeryutils

Atkinson, J. (2025). PyPip `archeryutils` Package. [online] Available at: https://pypi.org/project/archeryutils/.
