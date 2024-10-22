package com.bow.backend.service.impl.user.bot;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.bow.backend.mapper.BotMapper;
import com.bow.backend.pojo.Bot;
import com.bow.backend.pojo.User;
import com.bow.backend.service.impl.utils.UserDetailsImpl;
import com.bow.backend.service.user.bot.GetListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class GetListServiceImpl implements GetListService {

    @Autowired
    private BotMapper botMapper;
    @Override
    public List<Bot> getlist() {
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken)
                SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();

        QueryWrapper<Bot> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_Id",user.getId());
        return botMapper.selectList(queryWrapper);
    }
}
