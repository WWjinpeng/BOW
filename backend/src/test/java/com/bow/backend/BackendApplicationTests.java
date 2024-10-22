package com.bow.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        System.out.println(passwordEncoder.encode("wjp1"));
//        System.out.println(passwordEncoder.encode("wjp2"));
//        System.out.println(passwordEncoder.encode("wjp3"));
//        System.out.println(passwordEncoder.encode("wjp4"));
    }

}
