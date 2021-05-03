users = User.create([
  {
    email: "hello@world.com",
    password: "aaa111",
    username: "mr.topic"
  },
  {
    email: "bye@world.com",
    password: "aaa111",
    username: "mr.point"
  },
  {
    email: "greetings@world.com",
    password: "aaa111",
    username: "mr.comment"
  }
])
r = Random.new
i = 1
topic_list = []
while i <= 20
 hash = {}
 hash[:title] = "Cake roll chocolate_#{i}." 
 hash[:description] = "Beef ball prosciutto shank leberkas pork beef leberkas filet andouille mignon venison."
 hash[:pro] = "pro"
 hash[:con] = "con"
 hash[:category] = r.rand(1...6)
 hash[:views] = 0
 hash[:user] = users.first
 topic_list << hash
 i += 1
end

topics = Topic.create(topic_list)

markdown = "
# Lorem Ipsum
### Argument:
Mauris amet rutrum elit elit proin in mauris sit arcu dui  
tempus. Dui leo felis sollicitudin at fringilla nunc duis  
sapien. Orci sapien cursus sapien volutpat hendrerit fusce  
maecenas. Amet ut magna sapien non. Lectus duis arcu  
aliquam sit donec id tempus maecenas nunc rutrum nunc.  
Ultricies non consectetur arcu donec fusce sed at lorem  
]lacinia. Mauris amet ut sit ligula lacinia. Arcu arcu  
finibus magna cursus cursus eu dolor sapien maximus ipsum  
leo. Eu donec nec pulvinar cursus. Fringilla leo quam\
~~sagittis lorem adipiscing vulputate.~~  

- [x] Checked_1
- [ ] Unchecked

www.google.com

### Conclusion:
Mauris amet rutrum elit elit proin in mauris sit arcu dui  
tempus. Dui leo felis sollicitudin at fringilla nunc duis  
sapien. Orci sapien cursus sapien volutpat hendrerit fusce  
maecenas. Amet ut magna sapien non. Lectus duis arcu  
aliquam sit donec id tempus maecenas nunc rutrum nunc.  
Ultricies non consectetur arcu donec fusce sed at lorem  
lacinia. Mauris amet ut sit ligula lacinia. Arcu arcu  
finibus magna cursus cursus eu dolor sapien maximus ipsum  
leo. Eu donec nec pulvinar cursus. Fringilla leo quam  
sagittis lorem adipiscing vulputate.  

A table:
 
| a | b |
| - | - |s
"

points_list = []
topics.each do |topic|
  i = 1
  while i <= 10
    hash = {}
    hash[:title] = "Cake roll chocolate_#{i}." 
    hash[:position] = true
    hash[:markdown] = true
    hash[:argument] = markdown
    hash[:bright] = 0
    hash[:dim] = 0
    hash[:dark] = 0
    hash[:views] = 0
    hash[:topic] = topic
    hash[:user] = users.second
    points_list << hash
    i += 1
  end

  i = 1
  while i <= 10
    hash = {}
    hash[:title] = "Cake roll chocolate_#{i}." 
    hash[:position] = false
    hash[:markdown] = true
    hash[:argument] = markdown
    hash[:bright] = 0
    hash[:dim] = 0
    hash[:dark] = 0
    hash[:views] = 0
    hash[:topic] = topic
    hash[:user] = users.second
    points_list << hash
    i += 1
  end
end

points = Point.create(points_list)

comments_list = []
points.each do |point|
  i = 1
  while i <= 5
    hash = {}
    hash[:text] = "Cursus arcu arcu luctus sapien lacinia lectus eu finibus."
    hash[:point] = point
    hash[:user] = users.third
    comments_list << hash
    i += 1
  end
end 

comments = Comment.create(comments_list)

tags_list = [
  {
    name: "US Politics"
  },
  {
    name: "Stocks"
  },
  {
    name: "Coding"
  },
  {
    name: "Food"
  },
  {
    name: "Dead Memes"
  },
  {
    name: "Weird Porn"
  }
]

tags = Tag.create(tags_list)


# ratings_list = []
# points.each do |point|
#   hash = {}
#   hash[:rate] = [0, 1, 0]
#   hash[:point] = point
#   hash[:user] = user.first
#   ratings_list << hash
# end

# ratings = Rating.create(ratings_list)

