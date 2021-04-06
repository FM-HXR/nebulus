# README

# Table Design

## users

| Column             | Type   | Options                       |
| ------------------ | ------ | ----------------------------- |
| email              | string | null: false, uniqueness: true |
| encrypted_password | string | null: false                   |
| username           | string | null: false                   |
| preferences        | string | null: false, array: true      |

### Association

- has_many :items
- has_many :comments
- has_many :orders

## topics

| Column      | Type       | Options                   |
| ----------- | ---------- | ------------------------- |
| title       | string     | null: false               |
| category_id | integer    | null: false (active hash) |
| pro         | string     | null: false               |
| con         | string     | null: false               |
| user        | references | foreign_key: true         |

### Association

- belongs_to :user
- has_many :points
- has_many :topic_tags
- has_many :tags, through: topic_tags

## points

| Column     | Type       | Options                 |
| ---------- | ---------- | ----------------------- |
| title      | string     | null: false             |
| position   | boolean    | null: false             |
| main_point | text       | null: false             |
| conclusion | text       | null: false             |
| rating     | integer    | null: false array: true |
| user       | references | foreign_key: true       |
| topic      | references | foreign_key: true       |

### Association

- has_many :comments
- belongs_to :user
- belongs_to :topic

## comments

| Column | Type       | Options           |
| ------ | ---------- | ----------------- |
| text   | text       | null: false       |
| user   | references | foreign_key: true |
| point  | references | foreign_key: true |

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

3.0.0

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
