# README

## Heroku Link

https://nebulus-app.herokuapp.com/

# Table Design

## users

| Column             | Type   | Options                       |
| ------------------ | ------ | ----------------------------- |
| email              | string | null: false, uniqueness: true |
| encrypted_password | string | null: false                   |
| username           | string | null: false                   |
| preferences        | string | null: false, array: true      |

### Association

- has_many :topics
- has_many :points
- has_many :comments
- has_many :ratings

## topics

| Column      | Type       | Options           |
| ----------- | ---------- | ----------------- |
| title       | string     | null: false       |
| description | text       | null: false       |
| category_id | integer    | null: false       |
| pro         | string     | null: false       |
| con         | string     | null: false       |
| user        | references | foreign_key: true |

### Association

- belongs_to :user
- has_many :points
- has_many :topic_tags
- has_many :tags, through: topic_tags

## points

| Column   | Type       | Options           |
| -------- | ---------- | ----------------- |
| title    | string     | null: false       |
| position | boolean    | null: false       |
| argument | text       | null: false       |
| bright   | integer    | null: false       |
| dim      | integer    | null: false       |
| dark     | integer    | null: false       |
| user     | references | foreign_key: true |
| topic    | references | foreign_key: true |

### Association

- has_many :comments
- has_many :ratings
- belongs_to :user
- belongs_to :topic
- has_many_attached :images

## comments

| Column | Type       | Options           |
| ------ | ---------- | ----------------- |
| text   | text       | null: false       |
| user   | references | foreign_key: true |
| point  | references | foreign_key: true |

### Association

- belongs_to :user
- belongs_to :point

## ratings

| Column    | Type       | Options           |
| --------- | ---------- | ----------------- |
| rate_name | string     | null: false       |
| user      | references | foreign_key: true |
| point     | references | foreign_key: true |

### Association

- belongs_to :user
- belongs_to :point

## topic_tags

| Column | Type       | Options           |
| ------ | ---------- | ----------------- |
| topic  | references | foreign_key: true |
| tag    | references | foreign_key: true |

### Association

- belongs_to :topic
- belongs_to :tag

## tags

| Column | Type   | Options     |
| ------ | ------ | ----------- |
| name   | string | null: false |

### Association

- has_many :topic_tags
- has_many :topics, through:topic_tags

# Ruby Ver

3.0.1

# Rails Ver

6.1.3

# Bundled With

2.1.4

# Configuration

database.yml:
unicode

application.js:
turbolinks disabled

# Database

Postgresql 13.0

# ...
