package com.bow.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bow.backend.pojo.Record;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RecordMapper extends BaseMapper<Record> {
}
