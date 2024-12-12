package com.bow.backend.consumer.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private Integer id;
    private Integer botId; // -1亲自出马
    private String botCode;
    private Integer sx;
    private Integer sy;
    private List<Integer> steps;
    private boolean check_tail_increasing(int steps){ //当前回合蛇长度是否增加
        if(steps<=10) return true;
        return steps % 3 == 1;
    }
    public List<Cell> getCells(){
        List<Cell> res = new ArrayList<>();
        int []dx = {-1,0,1,0}, dy = {0,1,0,-1};
        int x = sx,y=sy;
        res.add(new Cell(x,y));
        int step = 0;
        for(int d:steps){
            x += dx[d];
            y += dy[d];
            res.add(new Cell(x,y));
            step++;
            if(!check_tail_increasing(step)) {
                res.remove(0);
            }
        }
        return res;
    }
    public String getStepsString() {
        StringBuilder res = new StringBuilder();
        for (int d: steps) {
            res.append(d);
        }
        return res.toString();
    }

}
