require 'sinatra/reloader'
require 'sinatra'
require 'awesome_print'

require './my_methods.rb'

class Rukogiri < Sinatra::Base

  register Sinatra::Reloader
  get '/json' do
    erb :json
  end

  post '/json/parse' do
    content_type 'application/json'
    ap params
    string=params[:string]
    begin
      params[:type] == "url" ? json=JSON.parse(open(string).read) : json=JSON.parse(string)

      array=params[:array]
      id=0
      unless array.nil?
        array.each {|e|
          id+=1
          puts e
          puts e.include? "Array index: "
          (e.include? "Array index: ") ? json=json[e[/\d+/].to_i] : json=json[e]
        }
      end
      p keys= ""
      p json.class

      json = Hash[(0...json.size).map {|z| "Array index: "+z.to_s}.zip json] if json.class==Array

      keys=json.keys if json.class==Hash
      ap select= params["array"].map {|e| e.gsub("Array index: ", '').to_s} if params['array']
      {array: json.to_json, select: select, keys: keys, id: id}.to_json
    rescue => e
      {error: e.message}.to_json

    end

  end

  get '/' do
    #
    #           <li id="map_text" class="chip">
    #             .map(&:text)
    #           </li>

    #
    #           <li id="array_index" class="chip">
    #               ["<input class="hidden-input " placeholder="value" required>"]
    #           </li>
    # <li id="format_numbers" class="chip">.map{|e| e.rjust(2, '0')}.to_s.delete('"').strip</li>
    #
    #
    #
    input = %w[at_css css xpath join split drop pop at take include? unshift insert delete_at delete]
    @li = input.map do |id|
      "<li class='chip' data-type='1' data-method='#{id}'>
       .#{id}(\"<input class='hidden-input cyan-text' placeholder='value' >\")
      </li>"
    end.join + '<br>'
    simple = %w[join split text first last reverse sort strip to_s to_i keys values count empty? pop shift compact flatten uniq class]
    @li += simple.map {|id| "<li class='chip' data-type='0' data-method='#{id}'>.#{id}</li>"}.join
    map_options = %w[text to_s to_i flatten sort].sort.map {|e| "<option value='#{e}'>#{e}</option>"}.join
    @li += "<li class='chip' data-type='2' data-method='map'>
       .map{&:
<select class='chip hidden-select cyan-text' >#{map_options}</select>
}
      </li>
"
    @doc=Hash.new
    @doc[:nokogiri]={method_select: ["css", "at_css"], method_simple: %w[join split text first last reverse sort strip to_s to_i keys values count empty? pop shift compact flatten uniq class]}
    @doc[:array]={method_input: ["join", "split"], method_simple: ["text"]}
    @nokogiri=@doc.map {|e| "<div id='#{e[0]}' class=''>    <ul class='method' class='connectedSortable'>"+e[1].map {|m| send(m[0], m[1])}.join+"</ul></div>"}.join


    erb :nokogiri
  end


  post '/nokogiri/url', provides: :json do


    string=params[:string]
    page = ''

    begin
      if params[:type] == "url"
        page = Nokogiri::HTML(MetaInspector.new(string, connection_timeout: 2, read_timeout: 2, retries: 0, faraday_options: { ssl: { verify: false } }).to_s)
      else
        page=string
        Nokogiri::HTML(string)
      end

      # end

      content = page.to_s
      tag_head= %w[head meta title script style link]
      tags = content.scan(/<(\w+).*?>/).flatten.uniq - tag_head
      classes = (content.scan(/class=\"(.*?)\"/).flatten.map(&:split).flatten.uniq.sort.map {|e| ".#{e}"})
      ids = (content.scan(/id=\"(.*?)\"/).flatten.map(&:split).flatten.uniq.sort.map {|e| "##{e}"})

      page=page.to_s.gsub(/<script.*?\/script>/m, '').gsub(/<iframe.*?\/iframe>/m, '').gsub(/<!--.*?-->/m, '').gsub(/<link.*?\/>/m, '').gsub(/<meta.*?>/m, '').gsub(/<style.*?\/style>/m, '').gsub(/<!.*?>/m, '').gsub(/<head.*?\/>/m, '').gsub /^\s+$\n/, ''.gsub('<br>', '').gsub('<hr>', '')

      response = {response: true, elements: {:classes => classes, :ids => ids, :tags => tags}, content: page}
    rescue => e
      response = {response: false, error: e.message}
    end

    response.to_json
  end


  def method_simple(input)
    input.map do |id|
      "<li class='chip z-depth-2' data-type='0' data-method='#{id}'>
       .#{id}
      </li>"
    end.join

  end

  def method_map()

  end


  def method_select(input)

    input.map do |id|
      "<li class='chip z-depth-2' data-type='1' data-method='#{id}'>
       .#{id}(\"<a href='#'></a>\")
      </li>"
    end.join

  end


  def method_input(input)

    input.map do |id|
      "<li class='chip z-depth-2' data-type='3' data-method='#{id}'>
       .#{id}(\"<a href='#'></a>\")
      </li>"
    end.join

  end


  post '/nokogiri/parse', provides: :json do
    content_type :json
    puts params
    puts
    puts params["info"]


    classes = response = ''


    string=params['source']['string']
    type=params['source']['type']
    page = ''

    begin
      if type == "url"
        page = Nokogiri::HTML(MetaInspector.new(string, connection_timeout: 2, read_timeout: 2, retries: 0, faraday_options: { ssl: { verify: false } }).to_s)
      else
        page=string
        Nokogiri::HTML(string)
      end





      response = {response: true, elements: {:classes => classes, :ids => ids, :tags => tags}, content: page}
    rescue => e
      response = {response: false, error: e.message}
    end

    response.to_json





    commands = params['info'].values if params['info']

    p commands.class
    p commands.count
    p commands
    json = {}
    text = page
    id = -255
    text_cmd = "Nokogiri::HTML(open(\"#{params['url']}\"}).read)"
    text_cmd_error = ''
    commands.map! do |cmd|
      puts cmd
      begin
        if cmd['type'].to_i == 1
          text = text.send(cmd[:method], cmd[:input])
          text_cmd += ".#{cmd[:method]}(\"#{cmd[:input]}\")"
        elsif cmd['type'].to_i.zero?
          text = text.send(cmd[:method])
          text_cmd += ".#{cmd[:method]}"
        elsif cmd['type'].to_i == 2

          meth = 'to_i'

          r = text.send('map')
          size = text.count
          text = Array.new(size) do |_z|
            r.next.send(cmd[:input])
          end

          text_cmd += ".map{&:#{cmd[:input]}}"

        end
      rescue => error
        text_cmd_error = text_cmd + ".#{cmd[:method]}"
        if cmd['type'].to_i == 1
          text_cmd_error = text_cmd + ".#{cmd[:method]}(\"#{cmd[:input]}\")"
        elsif cmd['type'].to_i.zero?
          text_cmd_error = text_cmd + ".#{cmd[:method]}"
        end
        id = cmd[:index]
        json['message'] = error.message
        break
      end
    end
    # puts id
    # puts text_cmd
    # puts text_cmd_error
    # puts text

    json['id'] = id
    json['text_cmd_error'] = text_cmd_error
    json['error'] = id != -255
    json['text_cmd'] = text_cmd
    # code = Rack::Utils.escape_html(text).split(/\r?\n|\r/)
    json['code'] = text#.map {|line| line.gsub(/\s+/, "\s")}.join("\r\n")
    json['code']
    json['empty'] = json['code'] == ''
   p json.to_json
  end
  get '/doc' do
    erb :doc
  end
end
