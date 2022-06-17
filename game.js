kaboom({
	global: true,
	fullscreen: true,
	scale: 1,
	debug: true,
})
const SPEED = 340
const ENEMY_SPEED = 160
const BULLET_SPEED = 800    
loadSprite("tubewidth", "Images/tubewidth.png");
loadSprite("tubeheight", "Images/tubeheight.png");
loadSprite("background", "Images/Background.png");
loadSprite("cicle", "Images/cicle.png");
loadSprite("ghosty","Images/ghosty.png");
function addButton(txt, p, f) {

	const btn = add([
		text(txt),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		origin("center"),
	])

	btn.onClick(f)

	btn.onUpdate(() => {
		if (btn.isHovering()) {
			const t = time() * 10
			btn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			btn.scale = vec2(1.2)
		} else {
			btn.scale = vec2(1)
			btn.color = rgb()
		}
	})

}
scene("over", () => {
	addButton("OVER", vec2(center()), () => go("game"))
})
scene("start", () => {
	addButton("START", vec2(center()), () => go("game"))
})
var sc = 0;
scene("game", () => {
    add([
        sprite("background"),
        pos(0,0),
    ])
    add([
        sprite("tubewidth"),
        pos(100,70),
        area(),
        solid(),
    ])
    add([
        sprite("tubewidth"),
        pos(100,580),
        area(),
        solid(),
    ])
    add([
        sprite("tubeheight"),
        pos(100,70),
        area(),
        solid(),
    ])
    add([
        sprite("tubeheight"),
        pos(1050,70),
        area(),
        solid(),
    ])
    add([
        sprite("tubeheight"),
        pos(1050,70),
        area(),
        solid(),
    ])
    const player = add([
        sprite("cicle"),
        pos(400, 400),
        area(),
        solid(),
        origin("center"),
    ])
    const enemy = add([
        sprite("ghosty"),
        pos(500,500),
        origin("center"),
        area(),
        solid(),
        state("move", [ "idle", "attack", "move", ]),
    ])
    
    enemy.onStateEnter("idle", async () => {
        await wait(0.5)
        enemy.enterState("attack")
    })
    label = add([
		text("Score: "+sc+"/10"),
		pos(100, 5),
	])
	label.onUpdate(() => {
		label.text = "Score: "+sc+"/10"
	})
    enemy.onStateEnter("attack", async () => {
        if (player.exists()) {
    
            const dir = player.pos.sub(enemy.pos).unit()
    
            const bu = add([
                pos(enemy.pos),
                move(dir, BULLET_SPEED),
                rect(12, 12),
                area(),
                cleanup(),
                origin("center"),
                color(BLUE),
                "bullet",
            ])
            bu.onUpdate(() => {
                if (bu.pos.x < 0 || bu.pos.x > 1000){
                    destroy(bu)
                }
                if (bu.pos.y < 0 || bu.pos.y > 1000){
                    destroy(bu)
                }
            });
    
        }

        await wait(1)
        sc++;
        enemy.enterState("move")
    
    })
    enemy.onStateEnter("move", async () => {
        await wait(2)
        enemy.enterState("idle")
    })
    
    enemy.onStateUpdate("move", () => {
        if (!player.exists()) return
        const dir = player.pos.sub(enemy.pos).unit()
        enemy.move(dir.scale(ENEMY_SPEED))
    })
    
    enemy.enterState("move")
    
    player.onCollide("bullet", (bullet) => {
        destroy(bullet)
        destroy(player)
        addKaboom(bullet.pos)
        wait(1.5, () => go("over"))
    })
    

    onKeyDown("left", () => {
        player.move(-SPEED, 0)
    })
    
    onKeyDown("right", () => {
        player.move(SPEED, 0)
    })
    
    onKeyDown("up", () => {
        player.move(0, -SPEED)
    })
    
    onKeyDown("down", () => {
        player.move(0, SPEED)
    })
    
});
go("game")