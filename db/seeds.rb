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

i = 1
topic_list = []
while i <= 10
 hash = {}
 hash[:title] = "Cake roll chocolate_#{i}." 
 hash[:description] = "Beef ball prosciutto shank leberkas pork beef leberkas filet andouille mignon venison."
 hash[:pro] = "pro"
 hash[:con] = "con"
 hash[:user] = users.first
 topic_list << hash
 i += 1
end

topics = Topic.create(topic_list)

points_list = []
topics.each do |topic|
  i = 1
  while i <= 10
    hash = {}
    hash[:title] = "Cake roll chocolate_#{i}." 
    hash[:position] = true
    hash[:argument] = "Cursus arcu arcu luctus sapien lacinia lectus eu finibus. 
                    Felis sed proin sollicitudin amet duis vulputate quis cursus pulvinar. 
                    Duis arcu ultricies fusce rutrum sed lorem. Dui fusce amet ipsum hendrerit fermentum leo ut. 
                    Ipsum eu felis nec sit cursus ipsum dui quam bibendum vulputate. Mauris donec leo mauris eu bibendum. 
                    Vulputate lacinia amet sed duis. Luctus sit elit lorem in fusce tempus at fusce aliquam amet. 
                    Sapien non interdum fusce purus convallis magna non ut. Fusce felis posuere lacinia sed. Sapien maecenas arcu leo cursus varius et."
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
    hash[:argument] = "Cursus arcu arcu luctus sapien lacinia lectus eu finibus. 
                    Felis sed proin sollicitudin amet duis vulputate quis cursus pulvinar. 
                    Duis arcu ultricies fusce rutrum sed lorem. Dui fusce amet ipsum hendrerit fermentum leo ut. 
                    Ipsum eu felis nec sit cursus ipsum dui quam bibendum vulputate. Mauris donec leo mauris eu bibendum. 
                    Vulputate lacinia amet sed duis. Luctus sit elit lorem in fusce tempus at fusce aliquam amet. 
                    Sapien non interdum fusce purus convallis magna non ut. Fusce felis posuere lacinia sed. Sapien maecenas arcu leo cursus varius et."
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



