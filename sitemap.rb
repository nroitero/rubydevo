require 'open-uri'
require 'nokogiri'
data=open('http://mangafox.com').read
doc = Nokogiri::HTML(data)
doc.traverse do |node|
 node.remove if  ["text","script","br","comment"].include? node.name
end

puts doc.to_xml