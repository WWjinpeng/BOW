import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";
export class GameMap extends AcGameObject {
    constructor(ctx, parent,store) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        this.L = 0;
        this.rows = 22;
        this.cols = 23;
        this.walls = [];
        this.snakes = [
            new Snake({ id: 0, color: "#4876EC", r: this.rows - 2, c: 1 }, this),
            new Snake({ id: 1, color: "#F94848", r: 1, c: this.cols - 2 }, this),
        ];
        this.obstacle = parseInt(this.rows * this.cols / 30);

    }
    // check_connectivity(g, sx, sy, ex, ey) {
    //     if (sx == ex && sy == ey) return true;
    //     g[sx][sy] = true;
    //     let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
    //     for (let i = 0; i < 4; i++) {
    //         let x = sx + dx[i], y = sy + dy[i];
    //         if (!g[x][y] && this.check_connectivity(g, x, y, ex, ey)) return true;
    //     }
    //     return false;
    // }
create_wall() {
    const g = this.store.state.pk.gamemap;
    console.log(g);
    // 检查 gamemap 是否已定义且是二维数组
    if (!Array.isArray(g) || !g.some(row => Array.isArray(row))) {
        console.error('gamemap is not a properly initialized 2D array');
        return false; // 或者抛出错误，取决于您的错误处理策略
    }

    // 检查 gamemap 的维度
    if (g.length < this.rows || g[0].length < this.cols) {
        console.log(g.length);
        console.log(g[0].length);
        console.error('gamemap dimensions are incorrect');
        return false; // 或者抛出错误
    }

    // 现有的创建墙壁逻辑
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            if (g[i][j]) {
                this.walls.push(new Wall(i, j, this));
            }
        }
    }
    return true;
}

        add_listening_events() {
        console.log(this.store.state.record);

        if (this.store.state.record.is_record) {
            let k = 0;

            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k ++ ;
            }, 300);
        } else {
            this.ctx.canvas.focus();
            
            this.ctx.canvas.addEventListener("keydown", e => {
                let d = -1;
                if (e.key === 'w') d = 0;
                else if (e.key === 'd') d = 1;
                else if (e.key === 's') d = 2;
                else if (e.key === 'a') d = 3;

                if (d >= 0) {
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }));
                }
            });
        }
    }


    start() {
        // for (let i = 0; i < 100000; i++) {
        //     this.create_wall();
        //     if (this.create_wall) break;
        // }
        this.create_wall();
        this.add_listening_events();
    }

    update_size() {
        this.L = Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows);
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    check_ready() {//判断两条蛇是否准备好进入下一回合
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }
    next_step() { //两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }
    check_valid(cell){ //判断是否撞到其他蛇的身体或者墙壁
        for(const wall of this.walls){
            if(wall.r===cell.r && wall.c === cell.c) return false;
        }
        for(const snake of this.snakes){
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()) k--;
            for(let i=0;i<k;i++){
                if(snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) return false;
            }
        }
        return true;
    }
    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }
    render() { //渲染，把游戏对象渲染到地图上
        const color_even = "#afeeee", color_odd = "#dcffff";
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if ((i + j) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                }
                else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(j * this.L, i * this.L, this.L, this.L);
            }
        }
    }
}