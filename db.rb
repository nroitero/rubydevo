require 'data_mapper' # requires all the gems listed above
require 'dm-migrations'
DataMapper::Logger.new($stdout, :info)
puts db = "mysql://sql11194297:ev7dyiZ8ud@sql11.freemysqlhosting.net/sql11194297?reconnect=true"
DataMapper.setup(:default, db)
class Command_sql
  include DataMapper::Resource

  property :id, Serial # An auto-increment integer key
  property :type, String
  property :method, Text # A text block, for longer string data.
  property :created_at, DateTime # A DateTime, for any date you might like.
end









class Post
  include DataMapper::Resource

  property :id, Serial

  has n, :comments
end

class Comment
  include DataMapper::Resource

  property :id,     Serial
  property :rating, Integer

  belongs_to :post  # defaults to required: true

  def self.popular
    all(:rating.gt => 3)
  end
end



DataMapper.finalize
# DataMapper.auto_migrate!
DataMapper.auto_upgrade!
Command_sql.create(type: 1,method: ".join(\"{{INPUT}}\")")
p Command_sql.all.count