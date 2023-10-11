package net.bestcompany.foliowatch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FoliowatchApplication {
	public static void main(String[] args) {
		SpringApplication.run(FoliowatchApplication.class, args);
	}
}
