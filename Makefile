.PHONY: server
server: hello.all.js hello.all.js.map jquery.min.js
	python -m SimpleHTTPServer 8000

hello.all.js:
	wget https://cdnjs.cloudflare.com/ajax/libs/hellojs/2.0.0-4/hello.all.js

hello.all.js.map:
	wget https://cdnjs.cloudflare.com/ajax/libs/hellojs/2.0.0-4/hello.all.js.map

jquery.min.js:
	wget https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
