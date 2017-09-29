def get_txt(command)
  if command['type'] == 'map_text'
    '.map{&:text}'
  else
    ".#{command['type']}(\"#{command['input']}\")"
  end
end


def run_cmd(command, text)
  codex = if command['type'] == 'map_text'
            eval('text.map(&:text)')
          elsif command['input']

            text.send(command['type'], "#{command['input']}")

          else
            text.send(command['type'])
          end


  codex
end


