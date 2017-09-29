require 'net/http'
require 'open-uri'
url="https://google.m"
# p Net::HTTP.get_response(URI.parse(url))
uri = URI.parse(url)
p uri.host
p uri.port

p @data= open(url, :read_timeout => 1)

p @data.read