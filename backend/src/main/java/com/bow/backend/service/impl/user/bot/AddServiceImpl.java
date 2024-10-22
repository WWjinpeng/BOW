package com.bow.backend.service.impl.user.bot;

import com.bow.backend.mapper.BotMapper;
import com.bow.backend.pojo.Bot;
import com.bow.backend.pojo.User;
import com.bow.backend.service.impl.utils.UserDetailsImpl;
import com.bow.backend.service.user.bot.AddService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AddServiceImpl implements AddService {
    @Autowired
    private BotMapper botMapper;
    @Override
    public Map<String, String> add(Map<String, String> data) {
        //首先要知道，当前需要插入机器人的用户是谁，应该先把用户ID取出来
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken)
                SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();
        // 上面这一坨是轮子，照着搞就行
        String title = data.get("title");
        String description = data.get("description");
        String content = data.get("content");
        Map<String,String> map = new HashMap<>();
        if(title == null || title.length()==0){
            map.put("error_message","标题不能为空");
            return map;
        }
        if(title.length() > 100){
            map.put("error_message","Bot名字的长度不能大于100");
            return map;
        }
        if(description == null || description.length()==0){
            description = "此用户太懒,什么都没留下~";
        }
        if(description.length() > 300){
            map.put("error_message","Bot描述的长度不能大于300");
            return map;
        }
        if(content == null || content.length() ==0){
            map.put("error_message","代码不能为空");
            return map;
        }
        if(content.length() > 10000){
            map.put("error_message","代码长度不能超过10000");
            return map;
        }
        Date now = new Date();
        Bot bot = new Bot(null,user.getId(),title,description,content,1500,now,now);
        botMapper.insert(bot);
        map.put("error_message","success");
        return map;
    }
}
