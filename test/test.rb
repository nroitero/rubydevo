require 'selenium-webdriver'
require 'headless'
headless = Headless.new
headless.start
@test=-1
`rm crop*`
`rm screen*`
def num
  return @test+=1
end
def screenshot(type,css)
  sleep 3
  el1= @driver.find_element(:css, "html")
  @driver.manage.window.resize_to(el1.size.width, el1.size.height+100)

 puts  el1.location.x + 1, el1.location.y + 1, el1.size.width, el1.size.height

  n=num
  @driver.save_screenshot('screenshot-'+n.to_s+'.png')

  el= @driver.find_element(type, css)
  image = ChunkyPNG::Image.from_file('screenshot-'+n.to_s+'.png')
  image.crop!(el1.location.x + 1, el.location.y + 1, el1.size.width, el.size.height)
  image.save('croped-'+n.to_s+'.png')



end



require "selenium-webdriver"
require 'chunky_png'


site = 'http://localhost:3000/json'

@driver = Selenium::WebDriver.for :chrome
@driver.navigate.to site
@driver.find_element(:id,"url").clear
@driver.find_element(:id,"url").send_keys "https://api.www.svenskaspel.se/draw/lotto/draws/result"

@driver.find_element(:class,"btn-submit").click

screenshot("id","data")


headless.destroy