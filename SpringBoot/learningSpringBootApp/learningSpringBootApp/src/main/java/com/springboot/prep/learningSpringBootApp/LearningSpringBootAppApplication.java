package com.springboot.prep.learningSpringBootApp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class LearningSpringBootAppApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(LearningSpringBootAppApplication.class, args);
	}

	private final PaymentService paymentService;

	//constructor dependancy injection
	public LearningSpringBootAppApplication(PaymentService paymentService){
		this.paymentService = paymentService;
	}

	@Override
	public void run(String... args) throws Exception{
		String payment = paymentService.pay();
		System.out.println(payment);
	}

}
