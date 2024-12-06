package com.bow.backend.service.impl.pk;

import com.bow.backend.consumer.WebSocketServer;
import com.bow.backend.service.pk.StartGameService;
import org.springframework.stereotype.Service;

@Service
public class StartGameServiceImpl implements StartGameService {
    @Override
    public String startGame(Integer aId, Integer bId) {
        System.out.println("start game: " + aId + ", " + bId);
        WebSocketServer.startGame(aId,bId);
        return "start game success";
    }
}
