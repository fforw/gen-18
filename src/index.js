import domready from "domready"
import "./style.css"
import Color from "./Color";

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;



function wrap(number)
{
    const n = number/TAU - (number/TAU | 0);
    return n < 0 ? TAU + n * TAU : n * TAU;
}

function randomRadius(radiusPower)
{
    const { width, height } = config

    const size = Math.min(width, height) * 0.02;
    const rnd = Math.random();
    return size * 0.2 + Math.pow(rnd, radiusPower) * size * 0.8

}

class Path {

    /**
     * current angle
     * @type {number}
     */
    angle = 0;

    /**
     * current position
     *
     * @type {number}
     */
    x = 0;

    /**
     * current position
     *
     * @type {number}
     */
    y = 0;
    /**
     *
     * @type {number}
     */
    r = 0;

    reset = false;

    nextAngle = 0;

    clockwise = true;

    lineWidth = 0;
    radiusPower = 0;

    constructor()
    {
        this.init()
    }

    init()
    {
        const angle = TAU/4//Math.random() * TAU


        const [sx, sy, vx, vy] = config.edges[ (wrap(angle + TAU/8) / (TAU/4))|0]

        this.radiusPower = 0.5 + 1.5 * Math.random()
        let r = randomRadius(this.radiusPower);


        let x;
        if (vx !== 0)
        {
            const range = vx - r * 2;
            x = sx - range/2 + range * Math.random();
        }
        else
        {
            x = sx + 0;
        }
        let y;
        if (vy !== 0)
        {
            const range = vy - r * 2;
            y = sy -range/2 + range * Math.random();
        }
        else
        {
            y = sy + 0;
        }


        this.startAngle = angle;
        this.endAngle = wrap(angle + TAU/2);
        this.r = r;
        this.x = x;
        this.y = y;
        this.color = Color.fromHSL(Math.random(), 1, 0.1 + 0.6 * Math.random()).toRGBA(0.5)
        this.reset = true;

        this.lineWidth = (3 + Math.random() * 3)|0
    }

    draw()
    {
        this.reset = false;
        const { width, height } = config

        let { startAngle, endAngle, r, x, y, clockwise, color, lineWidth} = this;

        const nextAngle = wrap(-TAU/4 - TAU * 0.35 + TAU * 0.7 * Math.random() );
        let nextRadius =  randomRadius(this.radiusPower)

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color
        ctx.beginPath();
        ctx.arc( x, y, r, startAngle, endAngle, !clockwise )
        ctx.stroke();

        startAngle = wrap(endAngle - TAU/2 );
        x += Math.cos(endAngle) * r
        y += Math.sin(endAngle) * r

        if (y < 0 || y >= height)
        {
            this.init();
        }
        else
        {

            x += Math.cos(startAngle + TAU/2) * nextRadius
            y += Math.sin(startAngle + TAU/2) * nextRadius

            this.clockwise = !clockwise;
            this.startAngle = startAngle;
            this.endAngle = wrap(nextAngle );
            this.r = nextRadius;

            this.x = x
            this.y = y
        }
    }
}


domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;
        config.edges = [
            [   width,  height/2,        0, height],
            [ width/2,  height,    width,        0],
            [       0,  height/2,        0, height],
            [ width/2,         0,  width,        0],
        ]

        canvas.width = width;
        canvas.height = height;


        const paint = () => {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = "#fff"
            const p = new Path()

            const count = 10000

            for (let i = 0; i < count; i++)
            {
                p.draw()
            }

            // while (!p.reset)
            // {
            //     p.draw();
            // }
        };


        paint();


        window.addEventListener("click", paint, true)
    }
);
