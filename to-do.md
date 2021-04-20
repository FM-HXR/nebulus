# Dev procedures

## Temp

- [ ] Update README
- [ ] Test Deployment to Heroku
- [ ] Finishing Resume
- [ ] Title Logo (Link)
- [ ] change background to css generated background to avoid copyright
- [ ] Link in Point and Topic that leads to upper layer
- [ ] Solve problem of fonts not reflecting on heroku
- [ ] User Login, Sign Up modals
- [x] Temporarily set top page to topics

- [ ] Basic Touch Ups
- [ ] Extra Features

## Setup

- [x] Created New with postgresql & react
- [x] Added Gems
- [x] Made ER

## DB, Model, API Controller (core features)

- [x] Entities & Migrations
- [x] Associations
- [x] Seeds
- [x] Json Serialization
- [x] Set Routing
- [x] API & Page Controllers and CRUD actions
- [x] Testing on Insomnia

## Interface (Basics)

- [x] Test React with HAML Jsx Loader
- [x] Show Topics
- [x] Show Topic
  - [x] Show Points
- [x] Show Point
  - [x] Show Comments
- [x] Post Topic
- [x] Post Point
- [x] Post Comment

## Styling & Model Viewer Implementation

- [x] Styled the basic structure of each component.
- [x] Testing Markup display for points with React & ~~Redcarpet~~ React Markdown.
  - [x] Make sure to run rails db:reset after adding markdown point.
- [x] Added basic animation using SCSS.

## Basic Touch ups

- [ ] User sign up params permit (application controller)
- [ ] Authenticate user
- [ ] URL guard (move_to_index method in AJAX)
- [x] Non User limits & appearance.
- [ ] Model Params Validation rules
  - [ ] Regular Expressions
  - [ ] Form Error Handling (modal window)
- [ ] Update Readme Table Design
- [ ] Code optimization & component compartmentalization (forms, messages etc) for Js & Scss

## 3D implementation

- [ ] Tested Model Viewer
- [ ] Created Background CG Graphics and Assets
  - [ ] Background 1920x1500?? (1920x1080 shrink size default)
    - x2 images joined seamlessly for show point page.
- [ ] Design Top page

## Extra Features (Not in order)

- [x] Ratings for points
- [ ] View count for topics & points.
- [ ] Tags, topic_tag relations.
- [ ] Category for topics.
- [ ] Category Logo for Topic widgets in Topics
- [ ] Search feature
  - [ ] Full text search for topics
  - [ ] Multiple Tags Search for topics
- [ ] Multiple Filters for...
- Topics (Controller response based)
  - [ ] Newest / oldest
  - [ ] "For You" (pref)
  - [ ] Categories
  - [ ] Most popular (total view count)
- Topic (sort points by Attributes)
  - [ ] Newest / oldest
  - [ ] Most popular (total rate count)
- Point (sort comments by Attributes)
  - [ ] Newest / oldest
  - [ ] Most Viewed
  - [ ] Most popular (total rate count)
- [ ] Multiple Filter for points for each side

  - [ ] Newest / oldest
  - [ ] Most Viewed
  - [ ] Most Rated (total rate count)

- [ ] User Avatar
  - [ ] Show Avatar & User within widget on Topic & Point page
- [ ] User Page + Edit/Delete
- [ ] User preference (in tags), user_tag relations??
- [ ] 2 Factor Auth login
- [ ] Enable Multiple Image Uploading for Point Form & preview thumb before posting.
- [ ] Uploaded images gallery component/widget in point page.
- [ ] Infinite loading for show topics
- [ ] "Load More" component for points
- [ ] Referencing other points in other topics as a link in references section (in points).

## Deployment & AWS, S3
