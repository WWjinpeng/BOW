import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;
        this.rows = 22;
        this.cols = 22;
        this.walls = [];
        this.obstacle = parseInt(this.rows * this.cols / 25);
    }
    check_connectivity(g, sx, sy, ex, ey) {
        if (sx == ex && sy == ey) return true;
        g[sx][sy] = true;
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, ex, ey)) return true;
        }
        return false;
    }
    create_wall() {
        const g = [];
        for (let i = 0; i < this.rows; i++) {
            g[i] = [];
            for (let j = 0; j < this.cols; j++) {
                g[i][j] = false;
            }
        }
        //边缘加上石头
        for (let i = 0; i < this.rows; i++) {
            g[i][0] = g[i][this.cols - 1] = true;
        }
        for (let j = 0; j < this.cols; j++) {
            g[0][j] = g[this.rows - 1][j] = true;
        }
        //创建随机石头
        for (let i = 0; i < this.obstacle; i++) {
            for (let j = 0; j < 1000; j++) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) continue;
                g[r][c] = g[c][r] = true;
                break;
            }
        }
        g[this.rows - 2][1] = g[1][this.cols - 2] = false;
        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (g[i][j]) {
                    this.walls.push(new Wall(i, j, this));
                }
            }
        }
        return true;
    }
    start() {
        for (let i = 0; i < 100000; i++) {
            this.create_wall();
            if (this.create_wall) break;
        }
    }
    update_size() {
        this.L = Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows);
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    update() {
        this.update_size();
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