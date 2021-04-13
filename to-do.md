# Dev procedures

## Week 2

## Temp

- [x] Post Topic
- [x] Post Comment
- [x] Detecting markdown for show point

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
  - [ ] Post Point with attached images.
  - [ ] Preview uploads as thumbnail via React
- [x] Testing Markup display for points with React & ~~Redcarpet~~ React Markdown.
  - [x] Make sure to run rails db:reset after adding markdown point.
- [ ] Added basic animation using SCSS.

## Touch ups #1

- [ ] User sign up params permit (application controller)
- [ ] Authenticate user
- [ ] URL guard (move_to_index method in AJAX)
- [ ] Non User limits & appearance.
- [ ] Model Params Validation rules
  - [ ] Regular Expressions
  - [ ] Form Error Handling (modal window)
- [ ] Update Readme Table Design
- [ ] Code optimization for Js & Scss

## 3D implementation

- [ ] Tested Model Viewer
- [ ] Created Background CG Graphics and Assets

## Extra Features (Not in order)

- [ ] User Avatar
- [ ] Uploaded image ref gallery component for points.
- [ ] Category Logo for Topic widgets in Topics
- [ ] Ratings for points & comments.
- [ ] View count for topics & points.
- [ ] Tags, topic_tag relations.
- [ ] Category for topics.
- [ ] User preference (in tags), user_tag relations??
- [ ] Search feature
  - [ ] Full text search
  - [ ] Multiple Tags Search
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
  - [ ] Most popular (total rate count)
- [ ] Multiple Filter for points for each side
  - [ ] Newest / oldest
  - [ ] Most Viewed
  - [ ] Most Rated (total rate count)
- [ ] Infinite loading for show topics
- [ ] Load More component for points
- [ ] Referencing other points in other topics as a link in references section (in points).

## Deployment & AWS, S3
