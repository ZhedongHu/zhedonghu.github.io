#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 8 张作品背景壁纸：与项目强相关、色彩更鲜艳、构图更丰富。
   暗色科技底 + 青/紫/绿/粉/琥珀多色光晕，纯抽象几何，无文字/数字/商标。"""
import os, math

W, H = 1600, 900
OUT = os.path.dirname(os.path.abspath(__file__))

CYAN, PURPLE, GREEN = "#4cc9f0", "#7b61ff", "#34d399"
PINK, AMBER = "#ff5d8f", "#ffb15c"
BASE = "#070a12"

def doc(defs, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'preserveAspectRatio="xMidYMid slice">'
        f'<defs>'
        f'<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0%" stop-color="#0a0e1c"/>'
        f'<stop offset="55%" stop-color="#0a0d18"/>'
        f'<stop offset="100%" stop-color="#0c0a18"/></linearGradient>'
        f'<filter id="blur" x="-60%" y="-60%" width="220%" height="220%">'
        f'<feGaussianBlur stdDeviation="46"/></filter>'
        f'<filter id="soft" x="-40%" y="-40%" width="180%" height="180%">'
        f'<feGaussianBlur stdDeviation="10"/></filter>'
        f'{defs}'
        f'</defs>'
        f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'
        f'{body}</svg>'
    )

def grid():
    lines = []
    for x in range(0, W + 1, 50):
        lines.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}" stroke="#9fd8ff" stroke-opacity="0.035"/>')
    for y in range(0, H + 1, 50):
        lines.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="#9fd8ff" stroke-opacity="0.035"/>')
    return '<g>' + ''.join(lines) + '</g>'

def orbs(specs):
    out = []
    for x, y, r, c, o in specs:
        out.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity="{o}" filter="url(#blur)"/>')
    return '<g>' + ''.join(out) + '</g>'

def gstop(gid, stops):
    s = f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">'
    for off, col in stops:
        s += f'<stop offset="{off}" stop-color="{col}"/>'
    return s + '</linearGradient>'

# ----------------------------------------------------------------- 1) 个人主页：网页线框
def personal():
    d = gstop("pg", [("0%", CYAN), ("50%", PURPLE), ("100%", PINK)])
    d += gstop("bar", [("0%", CYAN), ("100%", GREEN)])
    body = orbs([(360,240,300,CYAN,0.45),(1240,640,320,PURPLE,0.42),(980,200,240,PINK,0.3)])
    # 浏览器窗口线框
    x0,y0,w,h = 300,150,1000,600
    body += (f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="26" fill="#0c1426" '
             f'fill-opacity="0.55" stroke="url(#pg)" stroke-width="2.5"/>')
    # 顶栏
    body += f'<rect x="{x0}" y="{y0}" width="{w}" height="54" rx="26" fill="#ffffff" fill-opacity="0.06"/>'
    for i,c in enumerate([PINK,AMBER,GREEN]):
        body += f'<circle cx="{x0+34+i*30}" cy="{y0+27}" r="9" fill="{c}"/>'
    # hero 横幅
    body += (f'<rect x="{x0+40}" y="{y0+90}" width="{w-80}" height="150" rx="16" fill="url(#pg)" fill-opacity="0.5"/>')
    # 内容：左主列 + 右侧栏
    cols = [(x0+40, y0+270, 560, 60, CYAN),(x0+40, y0+350, 560, 60, PURPLE),
            (x0+40, y0+430, 420, 60, GREEN),(x0+40, y0+510, 540, 60, PINK)]
    for cx,cy,cw,ch,c in cols:
        body += f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" rx="12" fill="{c}" fill-opacity="0.32" stroke="{c}" stroke-opacity="0.7" stroke-width="1.5"/>'
    for i in range(3):
        yy = y0+270+i*95
        body += f'<rect x="{x0+640}" y="{yy}" width="320" height="80" rx="12" fill="{[PURPLE,GREEN,CYAN][i]}" fill-opacity="0.3" stroke="{[PURPLE,GREEN,CYAN][i]}" stroke-opacity="0.7" stroke-width="1.5"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 2) 关于我：发光头像环
def about():
    d = gstop("av", [("0%", CYAN), ("40%", PURPLE), ("75%", PINK), ("100%", AMBER)])
    body = orbs([(800,450,360,PURPLE,0.45),(520,260,240,CYAN,0.35),(1100,640,260,PINK,0.32)])
    cx,cy = 800,430
    # 头肩剪影（发光轮廓）
    body += (f'<path d="M620 640 Q620 470 800 470 Q980 470 980 640 Z" fill="url(#av)" fill-opacity="0.28" '
             f'stroke="url(#av)" stroke-width="3"/>')
    body += f'<circle cx="{cx}" cy="360" r="92" fill="url(#av)" fill-opacity="0.34" stroke="url(#av)" stroke-width="3"/>'
    # 多层光环
    for i,(r,c,o) in enumerate([(220,CYAN,0.6),(300,PURPLE,0.45),(380,PINK,0.32),(450,AMBER,0.22)]):
        body += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{c}" stroke-opacity="{o}" stroke-width="2.5"/>'
    # 沿环分布的粒子
    import random; random.seed(7)
    for r,c in [(300,PURPLE),(380,PINK)]:
        for k in range(8):
            a = math.pi*2*k/8 + r*0.3
            x = cx+r*math.cos(a); y = cy+r*math.sin(a)
            body += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.randint(5,9)}" fill="{c}" stroke="#fff" stroke-opacity="0.5"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 3) 2048：4x4 棋盘
def game2048():
    d = gstop("t1",[("0%",CYAN),("100%",PURPLE)])
    d += gstop("t2",[("0%",GREEN),("100%",CYAN)])
    d += gstop("t3",[("0%",PINK),("100%",AMBER)])
    body = orbs([(440,300,300,CYAN,0.42),(1180,600,320,GREEN,0.34),(900,200,240,PURPLE,0.32)])
    bx,by=440,150; n=4; pad=22; gap=20; cell=(1000-pad*2-(n-1)*gap)//n
    body += f'<rect x="{bx}" y="{by}" width="1000" height="600" rx="30" fill="#0c1426" fill-opacity="0.6" stroke="url(#t1)" stroke-width="2.5"/>'
    tiles=[PURPLE,CYAN,GREEN,PINK,AMBER,CYAN,PURPLE,GREEN,PINK,CYAN,GREEN,PURPLE,CYAN,PINK,AMBER,GREEN]
    idx=0
    for r in range(n):
        for c in range(n):
            x=bx+pad+c*(cell+gap); y=by+pad+r*(cell+gap)
            col=tiles[idx]; idx+=1
            body += (f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" rx="16" '
                     f'fill="{col}" fill-opacity="0.5" stroke="{col}" stroke-opacity="0.95" stroke-width="2"/>')
            body += f'<rect x="{x+6}" y="{y+6}" width="{cell-12}" height="{cell-12}" rx="12" fill="#ffffff" fill-opacity="0.08"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 4) 猜数字：刻度仪表盘
def guess():
    d = gstop("gd",[("0%",AMBER),("100%",GREEN)])
    body = orbs([(800,450,340,GREEN,0.4),(300,250,240,AMBER,0.3),(1300,650,260,PINK,0.28)])
    cx,cy=800,450; R=300
    body += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>'
    for k in range(60):
        a=math.pi*2*k/60
        inner=R-(13 if k%5==0 else 7)
        x1=cx+inner*math.cos(a); y1=cy+inner*math.sin(a)
        x2=cx+R*math.cos(a); y2=cy+R*math.sin(a)
        o=0.85 if k%5==0 else 0.4
        col=AMBER if k%5==0 else GREEN
        body += f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{col}" stroke-opacity="{o}" stroke-width="{2 if k%5==0 else 1}"/>'
    # 指针
    pa=math.radians(-120)
    body += f'<line x1="{cx}" y1="{cy}" x2="{cx+R*0.7*math.cos(pa):.0f}" y2="{cy+R*0.7*math.sin(pa):.0f}" stroke="url(#gd)" stroke-width="6" stroke-linecap="round"/>'
    body += f'<circle cx="{cx}" cy="{cy}" r="16" fill="url(#gd)"/>'
    # 横向数字线（刻度渐变条）
    body += f'<rect x="200" y="800" width="1200" height="14" rx="7" fill="url(#gd)" fill-opacity="0.5"/>'
    for i in range(11):
        x=200+i*120
        body += f'<circle cx="{x}" cy="807" r="9" fill="{PINK if i==7 else GREEN}"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 5) 计算机健康状况检查：监控仪表盘
def health():
    d = gstop("hb",[("0%",GREEN),("100%",CYAN)])
    body = orbs([(800,470,340,GREEN,0.4),(320,260,240,CYAN,0.32),(1280,640,240,PURPLE,0.3)])
    sx,sy,sw,sh=360,170,880,560
    body += f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="26" fill="#0c1426" fill-opacity="0.6" stroke="url(#hb)" stroke-width="2.5"/>'
    body += f'<rect x="{sx}" y="{sy}" width="{sw}" height="46" rx="26" fill="#ffffff" fill-opacity="0.06"/>'
    for i,c in enumerate([PINK,AMBER,GREEN]):
        body += f'<circle cx="{sx+32+i*28}" cy="{sy+23}" r="8" fill="{c}"/>'
    # 心电波形
    pts=[]; x=sx+50
    while x<sx+sw-50:
        pts.append(f"L{x:.0f} 360 L{x+30:.0f} 360 L{x+45:.0f} 360 L{x+58:.0f} 250 L{x+70:.0f} 470 L{x+82:.0f} 360 L{x+150:.0f} 360")
        x+=170
    body += f'<path d="M{sx+50} 360 {"".join(p[1:] for p in pts)}" fill="none" stroke="url(#hb)" stroke-width="4" stroke-linejoin="round"/>'
    # 仪表条（CPU/MEM/NET）
    for i,(bx,col) in enumerate([(sx+60,GREEN),(sx+360,CYAN),(sx+660,PINK)]):
        body += f'<rect x="{bx}" y="430" width="200" height="220" rx="14" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.12"/>'
        body += f'<rect x="{bx+20}" y="{650-(i+1)*40}" width="160" height="{(i+1)*40}" rx="10" fill="{col}" fill-opacity="0.55"/>'
        body += f'<rect x="{bx+20}" y="440" width="160" height="14" rx="7" fill="{col}" fill-opacity="0.8"/>'
    # 圆环进度
    body += f'<circle cx="{sx+sw-130}" cy="540" r="70" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="14"/>'
    body += f'<circle cx="{sx+sw-130}" cy="540" r="70" fill="none" stroke="url(#hb)" stroke-width="14" stroke-linecap="round" stroke-dasharray="330 440" transform="rotate(-90 {sx+sw-130} 540)"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 6) 浏览器主页：起始页
def browser():
    d = gstop("bs",[("0%",CYAN),("100%",PURPLE)])
    body = orbs([(500,470,320,CYAN,0.42),(1120,420,300,PURPLE,0.38),(820,800,260,PINK,0.26)])
    x0,y0,w,h=320,140,960,640
    body += f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="26" fill="#0c1426" fill-opacity="0.6" stroke="url(#bs)" stroke-width="2.5"/>'
    body += f'<rect x="{x0}" y="{y0}" width="{w}" height="50" rx="26" fill="#ffffff" fill-opacity="0.06"/>'
    for i,c in enumerate([PINK,AMBER,GREEN]):
        body += f'<circle cx="{x0+32+i*28}" cy="{y0+25}" r="8" fill="{c}"/>'
    # 居中搜索框
    body += f'<rect x="{x0+230}" y="{y0+90}" width="{w-460}" height="64" rx="32" fill="#ffffff" fill-opacity="0.08" stroke="url(#bs)" stroke-width="2"/>'
    body += f'<circle cx="{x0+280}" cy="{y0+122}" r="11" fill="none" stroke="{CYAN}" stroke-width="3"/>'
    body += f'<line x1="{x0+289}" y1="{y0+131}" x2="{x0+300}" y2="{y0+142}" stroke="{CYAN}" stroke-width="3"/>'
    # 3x3 speed-dial 彩色磁贴
    tiles=[CYAN,PURPLE,GREEN,PINK,AMBER,CYAN,PURPLE,GREEN,PINK]
    gx=x0+150; gy=y0+230; cw=200; ch=150; gap=40
    for i,t in enumerate(tiles):
        rr=i//3; cc=i%3
        x=gx+cc*(cw+gap); y=gy+rr*(ch+gap)
        body += f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" rx="18" fill="{t}" fill-opacity="0.42" stroke="{t}" stroke-opacity="0.9" stroke-width="2"/>'
        body += f'<circle cx="{x+cw//2}" cy="{y+ch//2}" r="26" fill="{t}" fill-opacity="0.9"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 7) 贪吃蛇：网格上的蛇
def snake():
    d = gstop("sn",[("0%",GREEN),("100%",CYAN)])
    body = orbs([(760,470,320,GREEN,0.4),(1180,250,240,PINK,0.28),(300,650,240,PURPLE,0.3)])
    gx,gy,gw,gh=300,150,1000,600; rows,cols=10,16
    cw=gw/cols; ch=gh/rows
    body += f'<rect x="{gx}" y="{gy}" width="{gw}" height="{gh}" rx="22" fill="#0c1426" fill-opacity="0.55" stroke="url(#sn)" stroke-width="2.5"/>'
    # 网格淡线
    gl=[]
    for i in range(1,cols): gl.append(f'<line x1="{gx+i*cw:.0f}" y1="{gy}" x2="{gx+i*cw:.0f}" y2="{gy+gh}" stroke="#ffffff" stroke-opacity="0.06"/>')
    for j in range(1,rows): gl.append(f'<line x1="{gx}" y1="{gy+j*ch:.0f}" x2="{gx+gw}" y2="{gy+j*ch:.0f}" stroke="#ffffff" stroke-opacity="0.06"/>')
    body += '<g>'+''.join(gl)+'</g>'
    # 蛇身路径（格点中心连线）
    cells=[(1,8),(1,7),(2,7),(2,6),(3,6),(3,5),(4,5),(4,4),(5,4),(5,3),(6,3),(6,2)]
    pts=[(gx+(c+0.5)*cw, gy+(r+0.5)*ch) for r,c in cells]
    dpath='M'+' L'.join(f"{x:.0f} {y:.0f}" for x,y in pts)
    body += f'<path d="{dpath}" fill="none" stroke="url(#sn)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.95"/>'
    for i,(x,y) in enumerate(pts):
        body += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{14 if i==len(pts)-1 else 9}" fill="{GREEN if i==len(pts)-1 else CYAN}" stroke="#fff" stroke-opacity="0.5"/>'
    # 果子（粉色圆）
    fr=(gx+(10+0.5)*cw, gy+(1+0.5)*ch)
    body += f'<circle cx="{fr[0]:.0f}" cy="{fr[1]:.0f}" r="16" fill="{PINK}"/>'
    body += f'<circle cx="{fr[0]:.0f}" cy="{fr[1]:.0f}" r="26" fill="{PINK}" opacity="0.3" filter="url(#soft)"/>'
    body += grid()
    return doc(d, body)

# ----------------------------------------------------------------- 8) 字符画设计器：点阵拼成心形
def asciiart():
    d = gstop("as",[("0%",CYAN),("50%",PURPLE),("100%",PINK)])
    body = orbs([(800,450,340,PURPLE,0.42),(400,300,240,CYAN,0.32),(1200,600,260,PINK,0.3)])
    cols,rows=30,18; gw=44; gh=44
    ox=(W-cols*gw)/2; oy=(H-rows*gh)/2
    palette=[CYAN,PURPLE,PINK,AMBER,GREEN]
    def inside(x,y):
        # 心形隐式方程（x,y 归一化到 [-1.5,1.5]）
        x=(x/ (cols/2.0)); y=-(y/(rows/2.0))
        return (x*x + y*y - 1)**3 - x*x*y*y*y <= 0
    dots=[]
    for r in range(rows):
        for c in range(cols):
            if inside(c-(cols-1)/2, r-(rows-1)/2):
                x=ox+c*gw; y=oy+r*gh
                dist=math.hypot(c-(cols-1)/2, r-(rows-1)/2)/math.hypot((cols-1)/2,(rows-1)/2)
                rad=3.5+(1-dist)*9
                col=palette[int(dist*len(palette))%len(palette)]
                dots.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rad:.1f}" fill="{col}" fill-opacity="{max(0.25,0.95-dist*0.5):.2f}"/>')
    body += '<g>'+''.join(dots)+'</g>'
    body += grid()
    return doc(d, body)

JOBS = [
    ("work-personal.svg", personal),
    ("work-about.svg", about),
    ("work-2048.svg", game2048),
    ("work-guess.svg", guess),
    ("work-health.svg", health),
    ("work-browser.svg", browser),
    ("work-snake.svg", snake),
    ("work-ascii.svg", asciiart),
]

if __name__ == "__main__":
    for fn, fnc in JOBS:
        open(os.path.join(OUT, fn), "w", encoding="utf-8").write(fnc())
        print("wrote", fn)
    print("--- total", len(JOBS))
