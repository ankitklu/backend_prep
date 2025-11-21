package com.springboot.prep.learningSpringBootApp;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

@Component
//@Service
//@RestController
//@Controller
//@Repository
@ConditionalOnProperty(name="payment.provider", havingValue="stripe")
public class StripePaymentService implements PaymentService{

    @Override
    public String pay(){
        String payment = "Stripe payment";
        System.out.println("Payment from: "+ payment);
        return payment;
    }
}
