package com.seminar.bookingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  // ← add this
public class BookingsystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookingsystemApplication.class, args);
    }
}