package com.bow.backend.service.user.bot;

import com.bow.backend.pojo.Bot;

import java.util.List;

public interface GetListService {
    List<Bot> getlist(); //返回每个人的bot列表,该信息已经存在了token里面，不需要给参数
}
