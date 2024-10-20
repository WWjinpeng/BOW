import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";
// import { GameMap } from "./GameMapObject";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        this.cells = [new Cell(info.r, info.c)]; //存放🐍的身体 cells[0]蛇头
        this.next_cell = null;
        this.speed = 5; //蛇每秒走五个格子
        this.direction = -1; // -1没有指令，0,1,2,3分别表示上右下左
        this.status = "idle"; //idle静止,move正在移动,die表示死亡
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];
        this.step = 0; //回合数
        this.eps = 1e-2;
        this.eye_direction = 0;
        if(this.id===1) this.eye_direction = 2; //左上角蛇朝上，右上角朝下。
        this.eye_dx = [  // 蛇眼睛不同方向的x的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [  // 蛇眼睛不同方向的y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ]

    }
    start() {

    }

    set_direction(d) {
        this.direction = d;
    }
    check_tail_increasing(){ //检测当前回合，蛇长度是否增加
        if(this.step<=10) return true;
        if(this.step%3===1) return true;
        return false;
    }
    next_step() {//将蛇的状态变为走下一步
        const d = this.direction;
        this.eye_direction = d;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;
        this.status = "move";
        this.step++;

        const k = this.cells.length;
        for (let i = k; i > 0; i--) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }
        if(!this.gamemap.check_valid(this.next_cell)){ //下一步撞到东西了，死掉了
            this.status = "die";
        }
    }
    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const dis = Math.sqrt(dx * dx + dy * dy);
        const move_distance = this.speed * this.timedelta / 1000; //每帧移动的举例
        const eps = 0.01;
        if (dis < eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle"; //停下来
            if(!this.check_tail_increasing()){ //如果不变长，砍掉蛇尾
                this.cells.pop();
            }
        }
        else {
            this.cells[0].x += move_distance * dx / dis;
            this.cells[0].y += move_distance * dy / dis;
            if(!this.check_tail_increasing()){ //如果不变长 蛇尾需要走到下一个地方
                 const k = this.cells.length;
                 const tail = this.cells[k-1];
                 const tail_target = this.cells[k-2];
                 const tail_x = tail_target.x - tail.x;
                 const tail_y = tail_target.y - tail.y;
                 tail.x += move_distance * tail_x / dis;
                 tail.x += move_distance * tail_y / dis;
            }
        }
    }
    update() { //每一帧执行一次
        if (this.status === 'move') {
            this.update_move();
        }
        this.render();

    }
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        if(this.status==="die") ctx.fillStyle = "White";
        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L *0.8/ 2, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
                continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++ ) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }

    }
}