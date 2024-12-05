package com.bow.backend.consumer;

import com.alibaba.fastjson.JSONObject;
import com.bow.backend.consumer.utils.Game;
import com.bow.backend.consumer.utils.JwtAuthentication;
import com.bow.backend.mapper.RecordMapper;
import com.bow.backend.mapper.UserMapper;
import com.bow.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {
    final public static ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    final private static CopyOnWriteArraySet<User> matchpool = new CopyOnWriteArraySet<>();
    private User user;
    private Session session = null;
    private static UserMapper userMapper;


    public static RecordMapper recordMapper;

    private Game game = null;
    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }
    @Autowired
    public void setRecordMapper(RecordMapper recordMapper) {
        WebSocketServer.recordMapper = recordMapper;
    }
    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        this.session = session;
        System.out.println("connected!");
        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);

        if (this.user != null) {
            users.put(userId, this);
        } else {
            this.session.close();
        }

        System.out.println(users);
    }


    @OnClose
    public void onClose() {
        // 关闭链接
        System.out.println("disconnected from websocket!");
        if (this.user != null) {
            users.remove(this.user.getId());
            matchpool.remove(this.user);
        }
    }
    private void startMatching(){
        System.out.println("startMatching");
        matchpool.add(this.user);
        while(matchpool.size() >= 2){
            Iterator<User> it = matchpool.iterator();
            User a = it.next(),b=it.next();
            matchpool.remove(a);
            matchpool.remove(b);

            Game game = new Game(22,23,22*23/30,a.getId(),b.getId());
            game.createMap();
            users.get(a.getId()).game = game;
            users.get(b.getId()).game = game;
            game.start();
            JSONObject respGame = new JSONObject();
            respGame.put("a_id",game.getPlayerA().getId());
            respGame.put("a_sx",game.getPlayerA().getSx());
            respGame.put("a_sy",game.getPlayerA().getSy());
            respGame.put("b_id",game.getPlayerB().getId());
            respGame.put("b_sx",game.getPlayerB().getSx());
            respGame.put("b_sy",game.getPlayerB().getSy());
            respGame.put("map",game.getG());
            JSONObject respA = new JSONObject();
            respA.put("event", "start-matching");
            respA.put("opponent_username", b.getUsername());
            respA.put("opponent_photo", b.getPhoto());
            respA.put("game", respGame);
            users.get(a.getId()).sendMessage(respA.toJSONString());

            JSONObject respB = new JSONObject();
            respB.put("event", "start-matching");
            respB.put("opponent_username", a.getUsername());
            respB.put("opponent_photo", a.getPhoto());
            respB.put("game", respGame);
            users.get(b.getId()).sendMessage(respB.toJSONString());

        }
    }
    private void stopMatching(){
        System.out.println("stopMatching");
        matchpool.remove(this.user);
    }

    private void move(int direction) {
        if (game.getPlayerA().getId().equals(user.getId())) {
            game.setNextStepA(direction);
        } else if (game.getPlayerB().getId().equals(user.getId())) {
            game.setNextStepB(direction);
        }
    }



    @OnMessage
    public void onMessage(String message, Session session) { //当作路由
        // 从Client接收消息
        System.out.println("received message: " + message);
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if(event.equals("start-matching")) {
            startMatching();
        }
        else if(event.equals("stop-matching")) {
            stopMatching();
        }
        else if(event.equals("move")) {
            move(data.getInteger("direction"));
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }
    public void sendMessage(String message) {
        synchronized (this.session){
            try{
                this.session.getBasicRemote().sendText(message);
            }catch (IOException e){
                e.printStackTrace();
            }
        }
    }
}