


array=["1agfgds","2sadgsdg","3sdghshsfgj"]
meth="to_i"

r=array.send("map")
size=array.count
res = size.times.map do |z|
  r.next.send(meth)
end
p res
