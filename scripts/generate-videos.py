from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
items=[
 ('capybara','CEO CAPYBARA','BRO JUST DISCOVERED COMPOUND INTEREST'),
 ('pigeon','CRYPTO PIGEON','BUY HIGH. SELL LOW. REPEAT.'),
 ('frog','FINANCE FROG','THE TAXES ARE TAXING'),
 ('raccoon','WI-FI RACCOON','HE STOLE THE NEIGHBOUR’S WIFI'),
]
font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
for slug,name,hook in items:
    image=root/f'public/characters/{slug}.webp'
    out=root/f'public/videos/{slug}.mp4'
    # Animate a 620x620 mascot layer with a gentle zoom, then composite onto a vertical dark canvas.
    filt=(
      "[0:v]scale=620:620:force_original_aspect_ratio=decrease,pad=620:620:(ow-iw)/2:(oh-ih)/2:color=0x101923,"
      "zoompan=z='1+0.035*sin(on/22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=144:s=620x620:fps=24,"
      "format=rgba[mascot];"
      "color=c=0x0b1018:s=720x1280:r=24:d=6[bg];"
      "[bg][mascot]overlay=(W-w)/2:190:shortest=1,"
      f"drawtext=fontfile={font}:text='{name}':fontcolor=0x4cc9f0:fontsize=30:x=(w-text_w)/2:y=82,"
      f"drawtext=fontfile={font}:text='{hook}':fontcolor=white:fontsize=27:line_spacing=12:x=(w-text_w)/2:y=900:box=1:boxcolor=0x17202ddd:boxborderw=18,"
      "drawtext=fontfile="+font+":text='BRAINROT X10  •  FOR YOU, UNFORTUNATELY':fontcolor=0xaab6c6:fontsize=15:x=(w-text_w)/2:y=1190"
    )
    cmd=['ffmpeg','-y','-loop','1','-i',str(image),'-filter_complex',filt,'-map','[outv]' if False else '0:v','-t','6','-an','-c:v','libx264','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-r','24','-movflags','+faststart',str(out)]
    # Use a simpler filter chain with an explicitly mapped filter output.
    filt=filt.replace("[bg][mascot]overlay=(W-w)/2:190:shortest=1,", "[bg][mascot]overlay=(W-w)/2:190:shortest=1,")
    filt += '[outv]'
    cmd[cmd.index('-filter_complex')+1]=filt
    cmd[cmd.index('-map')+1]='[outv]'
    subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
    print(out.name, out.stat().st_size)
