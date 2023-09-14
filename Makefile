build:
	docker build -t bestcompany/foliowatch .
run:
	docker run -p 8080:8080 bestcompany/foliowatch