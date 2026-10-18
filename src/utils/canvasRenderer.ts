import type { FiscalisMediaItem } from '../data/fiscalisMedia.ts';
import { calculateFitDimensions } from '../data/fiscalisMedia.ts';

export interface CanvasEngineState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  rendererType: 'canvas2d' | 'webgl';
  currentItem: FiscalisMediaItem | null;
  error: string | null;
}

export interface CanvasEngineOptions {
  canvas: HTMLCanvasElement;
  onStateChange?: (state: CanvasEngineState) => void;
}

/**
 * Robust, high-performance Canvas Rendering Engine for Fiscalis media assets.
 * Renders both web-optimized MP4 videos and high-resolution mobile screenshots
 * with hardware-accelerated 2D context, crisp DPI scaling, letterboxing and cyber HUD.
 */
export class FiscalisCanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private onStateChangeCb?: (state: CanvasEngineState) => void;

  private state: CanvasEngineState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    rendererType: 'canvas2d',
    currentItem: null,
    error: null,
  };

  // Video management
  private videoElement: HTMLVideoElement | null = null;
  private videoListeners: Array<{ type: string; handler: EventListener }> = [];
  private videoFrameCallbackId: number | null = null;

  // Image management
  private activeImage: HTMLImageElement | null = null;
  private imageCache: Map<string, HTMLImageElement> = new Map();

  // Animation and dimensions
  private animFrameId: number | null = null;
  private destroyed: boolean = false;
  private width: number = 800;
  private height: number = 450;
  private dpr: number = 1;

  constructor(options: CanvasEngineOptions) {
    this.canvas = options.canvas;
    this.onStateChangeCb = options.onStateChange;

    this.initContext();
    this.initVideoElement();
  }

  private initContext(): void {
    if (typeof window === 'undefined') return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = this.canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    if (!ctx) {
      this.state.error = 'No fue posible inicializar el contexto de Canvas.';
      this.notifyState();
      return;
    }

    this.ctx = ctx;
    this.state.rendererType = 'canvas2d';
    this.notifyState();
  }

  private initVideoElement(): void {
    if (typeof document === 'undefined') return;

    const v = document.createElement('video');
    v.crossOrigin = 'anonymous';
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    v.preload = 'auto';

    const addEvt = (type: string, handler: EventListener) => {
      v.addEventListener(type, handler);
      this.videoListeners.push({ type, handler });
    };

    addEvt('timeupdate', () => {
      this.state.currentTime = v.currentTime;
      this.state.duration = v.duration || 0;
      this.notifyState();
    });

    addEvt('play', () => {
      this.state.isPlaying = true;
      this.notifyState();
      this.startRenderLoop();
    });

    addEvt('pause', () => {
      this.state.isPlaying = false;
      this.notifyState();
      this.stopRenderLoop();
      this.render(); // draw paused state
    });

    addEvt('loadedmetadata', () => {
      this.state.duration = v.duration || 0;
      // Seek slightly to ensure frame 0 is decoded and painted immediately
      if (v.currentTime === 0) {
        v.currentTime = 0.05;
      }
      this.state.isLoading = false;
      this.notifyState();
      this.render();
    });

    addEvt('canplay', () => {
      this.state.isLoading = false;
      this.notifyState();
      this.render();
    });

    addEvt('seeked', () => {
      this.render();
    });

    addEvt('error', () => {
      this.state.isLoading = false;
      this.state.error = 'Error al cargar o decodificar el video en el canvas.';
      this.notifyState();
    });

    this.videoElement = v;
  }

  public async loadMedia(item: FiscalisMediaItem): Promise<void> {
    if (this.destroyed) return;

    this.state.isLoading = true;
    this.state.error = null;
    this.state.currentItem = item;
    this.notifyState();

    if (item.type === 'video') {
      await this.loadVideo(item);
    } else {
      await this.loadImage(item);
    }
  }

  private async loadVideo(item: FiscalisMediaItem): Promise<void> {
    if (!this.videoElement) return;

    this.stopRenderLoop();
    this.activeImage = null;
    this.videoElement.pause();
    this.videoElement.src = item.src;
    this.videoElement.load();

    // Try starting playback (muted autoplay is universally permitted)
    try {
      const playPromise = this.videoElement.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.state.isPlaying = true;
      }
    } catch {
      // If browser defers autoplay, ensure frame 0 is ready
      this.state.isPlaying = false;
    }

    this.state.isLoading = false;
    this.notifyState();
    this.render();
  }

  private async loadImage(item: FiscalisMediaItem): Promise<void> {
    this.stopRenderLoop();
    if (this.videoElement) {
      this.videoElement.pause();
      this.state.isPlaying = false;
    }

    this.state.currentTime = 0;
    this.state.duration = 0;

    // Check memory cache
    if (this.imageCache.has(item.src)) {
      this.activeImage = this.imageCache.get(item.src)!;
      this.state.isLoading = false;
      this.notifyState();
      this.render();
      return;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this.destroyed) return;
        this.imageCache.set(item.src, img);
        this.activeImage = img;
        this.state.isLoading = false;
        this.notifyState();
        this.render();
        resolve();
      };
      img.onerror = () => {
        this.state.isLoading = false;
        this.state.error = 'Error al cargar la imagen.';
        this.notifyState();
        resolve();
      };
      img.src = item.src;
    });
  }

  public async play(): Promise<void> {
    if (this.state.currentItem?.type !== 'video' || !this.videoElement) return;
    try {
      await this.videoElement.play();
      this.state.isPlaying = true;
      this.notifyState();
      this.startRenderLoop();
    } catch (e) {
      console.warn('[FiscalisCanvasEngine] Playback error:', e);
    }
  }

  public pause(): void {
    if (this.videoElement) {
      this.videoElement.pause();
      this.state.isPlaying = false;
      this.notifyState();
      this.stopRenderLoop();
      this.render();
    }
  }

  public togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(seconds: number): void {
    if (this.videoElement && !isNaN(seconds)) {
      const target = Math.max(0, Math.min(seconds, this.videoElement.duration || seconds));
      this.videoElement.currentTime = target;
      this.state.currentTime = target;
      this.notifyState();
      this.render();
    }
  }

  public seekRelative(deltaSeconds: number): void {
    if (this.videoElement) {
      this.seek(this.videoElement.currentTime + deltaSeconds);
    }
  }

  public resize(displayWidth: number, displayHeight: number): void {
    this.width = Math.max(displayWidth, 320);
    this.height = Math.max(displayHeight, 260);

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.render();
  }

  private startRenderLoop(): void {
    if (this.animFrameId !== null) return;

    const loop = () => {
      if (this.destroyed) return;
      this.render();

      if (this.state.isPlaying && this.state.currentItem?.type === 'video') {
        this.animFrameId = requestAnimationFrame(loop);
      } else {
        this.animFrameId = null;
      }
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopRenderLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /**
   * Main render method: draws background, media content, phone frame (if mobile), and cyber HUD.
   */
  public render(): void {
    const ctx = this.ctx;
    if (!ctx || this.destroyed) return;

    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // 1. Solid deep cyber background (Wine Obsidian)
    ctx.fillStyle = '#0d0608';
    ctx.fillRect(0, 0, w, h);

    // 2. Subtle technical background grid (beneath media)
    ctx.strokeStyle = 'rgba(80, 29, 41, 0.35)';
    ctx.lineWidth = 1;
    const step = 40;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // 3. Determine drawable resource and native dimensions
    let drawable: CanvasImageSource | null = null;
    let natW = 0;
    let natH = 0;

    const current = this.state.currentItem;
    if (current?.type === 'video' && this.videoElement) {
      drawable = this.videoElement;
      natW = this.videoElement.videoWidth || 1920;
      natH = this.videoElement.videoHeight || 912;
    } else if (this.activeImage && this.activeImage.complete && this.activeImage.naturalWidth > 0) {
      drawable = this.activeImage;
      natW = this.activeImage.naturalWidth;
      natH = this.activeImage.naturalHeight;
    }

    if (drawable && natW > 0 && natH > 0) {
      const isMobile = current?.category === 'mobile' || natH > natW;
      const padding = isMobile ? 32 : 24;
      const dims = calculateFitDimensions(w, h, natW, natH, padding);

      // Ambient glow beneath media
      ctx.save();
      ctx.shadowColor = 'rgba(229, 193, 88, 0.22)';
      ctx.shadowBlur = 24;

      if (isMobile) {
        // Mobile frame mockup with rounded corners
        const radius = 18;
        this.roundRect(ctx, dims.x - 4, dims.y - 4, dims.width + 8, dims.height + 8, radius + 2);
        ctx.fillStyle = '#1e0d14';
        ctx.fill();
        ctx.strokeStyle = 'rgba(229, 193, 88, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Clip rounded corners for phone screen
        ctx.save();
        this.roundRect(ctx, dims.x, dims.y, dims.width, dims.height, radius);
        ctx.clip();
        ctx.drawImage(drawable, dims.x, dims.y, dims.width, dims.height);
        ctx.restore();
      } else {
        // Direct cinematic landscape drawing
        ctx.drawImage(drawable, dims.x, dims.y, dims.width, dims.height);
      }
      ctx.restore();

      // 4. Cyber HUD corner brackets framing the active media
      this.drawCornerBrackets(ctx, dims.x, dims.y, dims.width, dims.height);

      // 5. Tech info watermark in bottom-right corner of media
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(229, 193, 88, 0.75)';
      ctx.textAlign = 'right';
      const label = `${natW}x${natH} • ${current?.type === 'video' ? 'CANVAS STREAM' : 'HIGH-RES'}`;
      ctx.fillText(label, dims.x + dims.width, dims.y + dims.height + 16);
    } else {
      // Placeholder while loading
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(229, 193, 88, 0.65)';
      ctx.textAlign = 'center';
      ctx.fillText('CARGANDO FRAME EN CANVAS...', w / 2, h / 2);
    }

    ctx.restore();
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  private drawCornerBrackets(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const k = 14;
    const pad = 6;
    const left = x - pad;
    const top = y - pad;
    const right = x + width + pad;
    const bottom = y + height + pad;

    ctx.strokeStyle = '#e5c158';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(left, top + k);
    ctx.lineTo(left, top);
    ctx.lineTo(left + k, top);
    // Top-Right
    ctx.moveTo(right - k, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, top + k);
    // Bottom-Left
    ctx.moveTo(left, bottom - k);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left + k, bottom);
    // Bottom-Right
    ctx.moveTo(right - k, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, bottom - k);
    ctx.stroke();
  }

  private notifyState(): void {
    if (this.onStateChangeCb && !this.destroyed) {
      this.onStateChangeCb({ ...this.state });
    }
  }

  public getState(): CanvasEngineState {
    return { ...this.state };
  }

  public destroy(): void {
    this.destroyed = true;
    this.stopRenderLoop();

    if (this.videoElement) {
      this.videoElement.pause();
      for (const { type, handler } of this.videoListeners) {
        this.videoElement.removeEventListener(type, handler);
      }
      this.videoListeners = [];
      this.videoElement.src = '';
      this.videoElement = null;
    }

    this.imageCache.clear();
    this.activeImage = null;
    this.ctx = null;
  }
}
