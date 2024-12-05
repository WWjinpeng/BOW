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
        // const g = [];
        // for (let i = 0; i < this.rows; i++) {
        //     g[i] = [];
        //     for (let j = 0; j < this.cols; j++) {
        //         g[i][j] = false;
        //     }
        // }
        // //边缘加上石头
        // for (let i = 0; i < this.rows; i++) {
        //     g[i][0] = g[i][this.cols - 1] = true;
        // }
        // for (let j = 0; j < this.cols; j++) {
        //     g[0][j] = g[this.rows - 1][j] = true;
        // }
        // //创建随机石头
        // for (let i = 0; i < this.obstacle; i++) {
        //     for (let j = 0; j < 1000; j++) {
        //         let r = parseInt(Math.random() * this.rows);
        //         let c = parseInt(Math.random() * this.cols);
        //         if (g[r][c] || g[this.rows - r - 1][this.cols - c - 1]) continue;
        //         g[r][c] = g[this.rows - r - 1][this.cols - c - 1] = true;
        //         break;
        //     }
        // }
        // g[this.rows - 2][1] = g[1][this.cols - 2] = false;
        // const copy_g = JSON.parse(JSON.stringify(g));
        // if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;
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
        this.ctx.canvas.focus();
        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === 'w') {
                // snake0.set_direction(0);
                d = 0;
            }
            else if (e.key === 'd') {
                // snake0.set_direction(1);
                d = 1;
            }
            else if (e.key === 's') {
                // snake0.set_direction(2);
                d = 2;
            }
            else if (e.key === 'a') {
                // snake0.set_direction(3);
                d = 3;
            }
            if(d >= 0){
                this.store.state.pk.socket.send(JSON.stringify({
                    event: "move",
                    direction: d,
                }));
            }
            // else if (e.key === 'ArrowUp') {
            //     snake1.set_direction(0);
            // }
            // else if (e.key === 'ArrowRight') {
            //     snake1.set_direction(1);
            // }
            // else if (e.key === 'ArrowDown') {
            //     snake1.set_direction(2);
            // }
            // else if (e.key === 'ArrowLeft') {
            //     snake1.set_direction(3);
            // }
        });
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
        const color_even = "#5FB58A", color_odd = "#AAD751";
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