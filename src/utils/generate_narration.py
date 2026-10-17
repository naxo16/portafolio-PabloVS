import asyncio
import edge_tts
import subprocess
import os

FFMPEG = r"C:\Users\Seiketsu_Yamigiri\AppData\Local\Programs\Python\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
OUT_AUDIO = r"C:\Users\Seiketsu_Yamigiri\Downloads\stitch_professional_ti_services_hub\renkaidev-web\public\images\fiscalis\fiscalis-audio-guia.mp3"

# Segmented text with exact pacing matching the video scenes:
# 00:00 - 00:05: Splashart inicial
# 00:05 - 00:09: Login e ingreso con credenciales admin admin
# 00:09 - 00:15: Formulario operativo de infracción y captura en terreno
# 00:15 - 00:20: Ajustes técnicos y doble factor TOTP
# 00:20 - 00:24: Sincronización offline-first

TEXT = (
    "Bienvenido al MVP de Fiscalis. "
    "Iniciamos con el splash institucional y el acceso de inspectores con credenciales de prueba admin admin. "
    "En el formulario operativo capturamos patente, ubicación GPS satelital y evidencia fotográfica. "
    "La app incluye ajustes de endpoint, segundo factor TOTP, y sincronización offline lista para terreno."
)

async def generate():
    # es-CL-LorenzoNeural gives a very crisp, authoritative tech narrator voice
    communicate = edge_tts.Communicate(TEXT, "es-CL-LorenzoNeural", rate="+6%")
    await communicate.save(OUT_AUDIO)
    print("Generated audio:", OUT_AUDIO)

asyncio.run(generate())

# Check duration with ffmpeg
cmd = [FFMPEG, "-i", OUT_AUDIO]
res = subprocess.run(cmd, stderr=subprocess.PIPE, text=True)
for line in res.stderr.splitlines():
    if "Duration" in line:
        print(line.strip())
