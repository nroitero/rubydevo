require 'open-uri'
require 'nokogiri'


germankeno = Nokogiri::HTML (open('https://www.lotto-hessen.de/keno/gewinnzahlen-quoten/gewinnzahlen'))


p @gkenonumbers = germankeno.css('.drawing-wrapper').css('.drawing').css('li').map { |e| e.text.strip.rjust(2, '0')  }
p @plus5 = germankeno.css('.drawing-list').css('li')[0].text.delete("\n\\ ")
