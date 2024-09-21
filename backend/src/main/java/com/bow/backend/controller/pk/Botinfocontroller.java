package com.bow.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pk/")
public class Botinfocontroller {
    @RequestMapping("botinfo/")
    public String botinfo() {
        return "hhh";
    }
}
