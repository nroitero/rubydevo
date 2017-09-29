require 'open-uri'
require 'nokogiri'
require 'awesome_print'

data=open('http://mangafox.com').read
clean=data.gsub(/<script.*?\/script>/m, '').gsub(/<!--.*?-->/m, '').gsub(/<link.*?\/>/m, '').gsub(/<meta.*?>/m, '').gsub(/<style.*?\/style>/m, '').gsub /^\s+$\n/, ''.gsub('<br>', '').gsub('<hr>', '')

clean += clean.gsub('<br>', '').gsub('<hr>', '')
clean = clean.gsub(/data-\w+=\".*?\"/m, '').gsub(/data-\w+=\'.*?\'/m, '')
doc = Nokogiri::HTML(clean)




exit
doc.traverse {|node| result << node }
p result.count

# or,
require 'enumerator'
 result = doc.enum_for(:traverse).map
exit

clean = clean.gsub(/data-\w+=\".*?\"/m, '').gsub(/data-\w+=\'.*?\'/m, '')
doc = Nokogiri::HTML(clean)
doc.traverse do |node|
  node.remove if node.text?
end
puts doc
