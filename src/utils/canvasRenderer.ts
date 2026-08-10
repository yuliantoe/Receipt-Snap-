import { StoreSettings, ThermalFilter, LayoutMode, ReceiptItem, ReceiptStyle } from '../types';

interface RenderParams {
  photos: string[]; // base64/data URLs
  settings: StoreSettings;
  filter: ThermalFilter;
  layout: LayoutMode;
  receiptStyle?: ReceiptStyle;
  items: ReceiptItem[];
  sessionCode: string;
  userName: string;
  customerName?: string;
  selectedStickers?: string[];
  motto?: string;
  vibeRating?: string;
}

// Convert image URL to HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

// Apply Thermal Filter to a Canvas Context
function applyFilterToContext(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: ThermalFilter,
  ditherStrength: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;

    if (filter === 'monochrome') {
      // High contrast thermal black/white threshold
      const threshold = 128 - (ditherStrength - 5) * 8;
      const v = gray > threshold ? 255 : 15;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    } else if (filter === 'halftone') {
      // Ordered Bayer dither simulation
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);
      const bayerMatrix = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]
      ];
      const matrixVal = bayerMatrix[y % 4][x % 4] * 16;
      const v = gray + (matrixVal - 128) * (ditherStrength / 8) > 128 ? 250 : 20;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    } else if (filter === 'cyberpunk') {
      // Cyberpunk Green/Black matrix thermal
      const v = gray > 110 ? 255 : 20;
      if (v === 255) {
        data[i] = 16;
        data[i + 1] = 240;
        data[i + 2] = 120;
      } else {
        data[i] = 10;
        data[i + 1] = 20;
        data[i + 2] = 15;
      }
    } else if (filter === 'high_contrast') {
      // Extreme punchy contrast
      gray = Math.min(255, Math.max(0, (gray - 128) * 1.8 + 128));
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    } else if (filter === 'vintage') {
      // Warm thermal sepia
      data[i] = Math.min(255, gray * 1.05 + 10);
      data[i + 1] = Math.min(255, gray * 0.95);
      data[i + 2] = Math.min(255, gray * 0.8);
    } else if (filter === 'inverted') {
      // White print on black background
      const v = gray > 128 ? 20 : 240;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    } else if (filter === 'soft_grain') {
      // Grainy grayscale
      const noise = (Math.random() - 0.5) * 30;
      const v = Math.min(255, Math.max(0, gray + noise));
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Draw a Zigzag / Torn paper edge
function drawZigzagEdge(
  ctx: CanvasRenderingContext2D,
  width: number,
  y: number,
  direction: 'top' | 'bottom',
  bgColor: string = '#fdfbf7'
) {
  const teethWidth = 12;
  const teethHeight = 8;
  ctx.save();
  ctx.fillStyle = bgColor;
  ctx.beginPath();

  if (direction === 'top') {
    ctx.moveTo(0, y + teethHeight);
    for (let x = 0; x < width; x += teethWidth) {
      ctx.lineTo(x + teethWidth / 2, y);
      ctx.lineTo(x + teethWidth, y + teethHeight);
    }
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
  } else {
    ctx.moveTo(0, y - teethHeight);
    for (let x = 0; x < width; x += teethWidth) {
      ctx.lineTo(x + teethWidth / 2, y);
      ctx.lineTo(x + teethWidth, y - teethHeight);
    }
    ctx.lineTo(width, y + 30);
    ctx.lineTo(0, y + 30);
  }

  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw Barcode lines
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save();
  ctx.fillStyle = '#111827';
  let currentX = x;
  while (currentX < x + width) {
    const barWidth = Math.floor(Math.random() * 4) + 1;
    const gap = Math.floor(Math.random() * 3) + 1;
    ctx.fillRect(currentX, y, barWidth, height);
    currentX += barWidth + gap;
  }
  ctx.restore();
}

// Draw Stamp / Sticker
function drawStickerStamp(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  angleRad: number = -0.15
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);

  // Outer dashed box
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 3]);
  ctx.strokeRect(-75, -20, 150, 40);

  ctx.fillStyle = '#111827';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

// Helper to draw rounded rectangle safely
function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function renderThermalReceiptCanvas(params: RenderParams): Promise<string> {
  const {
    photos,
    settings,
    filter,
    layout,
    receiptStyle = 'classic_thermal',
    items,
    sessionCode,
    userName,
    customerName,
    selectedStickers = [],
    motto,
    vibeRating
  } = params;

  // Thermal paper width configuration
  const canvasWidth = settings.paperWidth === '58mm' ? 440 : 560;

  // Calculate dynamic canvas height
  const photoHeight = layout === 'grid_2x2' ? 200 : 260;
  const numPhotoRows = layout === 'grid_2x2' ? 2 : Math.min(photos.length, 4);

  const headerHeight = 240;
  const photosTotalHeight = numPhotoRows * (photoHeight + 25);
  const itemsHeight = (items.length + 5) * 28 + 90;
  const footerHeight = 230;

  const totalCanvasHeight = headerHeight + photosTotalHeight + itemsHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = totalCanvasHeight;
  const ctx = canvas.getContext('2d')!;

  // Paper Background (Off-white thermal paper tone)
  const isDarkPaper = filter === 'inverted';
  const paperColor = isDarkPaper ? '#111827' : '#fdfbf7';
  const textColor = isDarkPaper ? '#f9fafb' : '#111827';

  ctx.fillStyle = paperColor;
  ctx.fillRect(0, 0, canvasWidth, totalCanvasHeight);

  // Outer border for Magazine Cover style
  if (receiptStyle === 'magazine_cover') {
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, canvasWidth - 24, totalCanvasHeight - 24);
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, canvasWidth - 32, totalCanvasHeight - 32);
  } else if (receiptStyle === 'magazine_lookbook') {
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, canvasWidth - 30, totalCanvasHeight - 30);
  }

  // Paper Top Tear Edge
  if (settings.paperTearStyle === 'zigzag') {
    drawZigzagEdge(ctx, canvasWidth, 0, 'top', paperColor);
  }

  let currentY = 35;

  // --- HEADER SECTION BY STYLE ---
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';

  if (receiptStyle === 'magazine_cover') {
    // 📰 Magazine Cover Masthead
    ctx.font = '900 32px "Courier New", Courier, monospace';
    ctx.fillText('G E N - Z  M A G A Z I N E', canvasWidth / 2, currentY);
    currentY += 26;

    ctx.font = 'bold 11px "Courier New", Courier, monospace';
    ctx.fillText('SPECIAL PHOTOBOOTH EDITORIAL ISSUE • VOL. 2026', canvasWidth / 2, currentY);
    currentY += 22;

    ctx.font = '10px "Courier New", Courier, monospace';
    ctx.fillText(`ISSUE #08 | PRICE: ${settings.currencySymbol}${(settings.pricePerPrint || 25000).toLocaleString('id-ID')} | FREE STICKER`, canvasWidth / 2, currentY);
    currentY += 22;

    ctx.fillText('====================================================', canvasWidth / 2, currentY);
    currentY += 22;

  } else if (receiptStyle === 'magazine_lookbook') {
    // 🎨 Magazine Lookbook Header
    ctx.font = '900 26px "Courier New", Courier, monospace';
    ctx.fillText('E S T E T I K   L O O K B O O K', canvasWidth / 2, currentY);
    currentY += 26;

    ctx.font = 'italic 12px "Courier New", Courier, monospace';
    ctx.fillText('--- AUTUMN/WINTER ESSENTIALS CATALOG ---', canvasWidth / 2, currentY);
    currentY += 22;

    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillText(`${settings.storeName.toUpperCase()} • ${settings.address}`, canvasWidth / 2, currentY);
    currentY += 22;

    ctx.fillText('----------------------------------------------------', canvasWidth / 2, currentY);
    currentY += 22;

  } else if (receiptStyle === 'korean_life4cuts') {
    // 📸 Korean Life4Cuts (인생네컷) Header
    ctx.font = '900 28px "Courier New", Courier, monospace';
    ctx.fillText('인생네컷 ★ LIFE 4 CUTS', canvasWidth / 2, currentY);
    currentY += 28;

    ctx.font = 'bold 13px "Courier New", Courier, monospace';
    ctx.fillText('오늘도 예쁜 우리들의 순간 ♡', canvasWidth / 2, currentY);
    currentY += 22;

    const dateStrKr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillText(`[ ${dateStrKr} ] • ${settings.storeName}`, canvasWidth / 2, currentY);
    currentY += 22;

    ctx.fillText('♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡ ★ ♡', canvasWidth / 2, currentY);
    currentY += 22;

  } else if (receiptStyle === 'korean_cafe') {
    // ☕ Korean Cafe Receipt (한국 카페 영수증)
    ctx.font = '900 24px "Courier New", Courier, monospace';
    ctx.fillText('성수동 감성 스튜디오 & 카페', canvasWidth / 2, currentY);
    currentY += 26;

    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillText('HONGDAE VIBES PHOTO CAFE', canvasWidth / 2, currentY);
    currentY += 20;

    ctx.font = '10px "Courier New", Courier, monospace';
    ctx.fillText(`서울특별시 마포구 어울마당로 | IG: ${settings.instagram}`, canvasWidth / 2, currentY);
    currentY += 20;

    ctx.fillText('----------------------------------------------------', canvasWidth / 2, currentY);
    currentY += 22;

  } else if (receiptStyle === 'y2k_korean') {
    // 👾 Y2K Cyber Korean Photobooth
    ctx.font = '900 26px "Courier New", Courier, monospace';
    ctx.fillText('K-PHOTO KIOSK ★ Y2K STUDIO', canvasWidth / 2, currentY);
    currentY += 26;

    ctx.font = 'bold 12px "Courier New", Courier, monospace';
    ctx.fillText('[ K-AURA: 9999 P ] ★ [ 100% CUTE MAX ]', canvasWidth / 2, currentY);
    currentY += 22;

    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillText('彡★ CYBER MEMORY DISK 2026 ★彡', canvasWidth / 2, currentY);
    currentY += 22;

    ctx.fillText('====================================================', canvasWidth / 2, currentY);
    currentY += 22;

  } else {
    // 🧾 Standard Classic Thermal Header
    ctx.font = '900 24px "Courier New", Courier, monospace';
    ctx.fillText(settings.logoText || settings.storeName, canvasWidth / 2, currentY);
    currentY += 28;

    ctx.font = '13px "Courier New", Courier, monospace';
    ctx.fillText(settings.slogan, canvasWidth / 2, currentY);
    currentY += 20;

    ctx.font = '11px "Courier New", Courier, monospace';
    ctx.fillText(settings.address, canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText(`IG: ${settings.instagram} | TikTok: ${settings.tiktok}`, canvasWidth / 2, currentY);
    currentY += 24;

    ctx.font = '14px "Courier New", Courier, monospace';
    ctx.fillText('----------------------------------------------------', canvasWidth / 2, currentY);
    currentY += 20;
  }

  // Meta Info
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  ctx.textAlign = 'left';
  const leftX = 30;
  const rightX = canvasWidth - 30;

  ctx.font = '12px "Courier New", Courier, monospace';
  ctx.fillText(`TRX ID : ${sessionCode}`, leftX, currentY);
  ctx.textAlign = 'right';
  ctx.fillText(`${dateStr} ${timeStr}`, rightX, currentY);
  currentY += 20;

  ctx.textAlign = 'left';
  ctx.fillText(`OPERATOR: ${userName.toUpperCase()}`, leftX, currentY);
  if (customerName) {
    ctx.textAlign = 'right';
    ctx.fillText(`GUEST: ${customerName.toUpperCase()}`, rightX, currentY);
  }
  currentY += 22;

  ctx.textAlign = 'center';
  ctx.fillText('====================================================', canvasWidth / 2, currentY);
  currentY += 25;

  // --- PHOTOS SECTION ---
  const loadedImgs = await Promise.all(photos.map((p) => loadImage(p)));

  if (layout === 'grid_2x2' && loadedImgs.length >= 4) {
    const boxW = (canvasWidth - 70) / 2;
    const boxH = photoHeight;

    // Row 1
    for (let col = 0; col < 2; col++) {
      const idx = col;
      const pX = leftX + col * (boxW + 10);

      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = boxW;
      photoCanvas.height = boxH;
      const pCtx = photoCanvas.getContext('2d')!;

      pCtx.drawImage(loadedImgs[idx], 0, 0, boxW, boxH);
      applyFilterToContext(pCtx, boxW, boxH, filter, settings.ditherStrength);

      ctx.drawImage(photoCanvas, pX, currentY);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;

      if (receiptStyle === 'korean_life4cuts') {
        drawRoundRect(ctx, pX, currentY, boxW, boxH, 12);
        ctx.stroke();
      } else {
        ctx.strokeRect(pX, currentY, boxW, boxH);
      }
    }
    currentY += boxH + 10;

    // Row 2
    for (let col = 0; col < 2; col++) {
      const idx = col + 2;
      const pX = leftX + col * (boxW + 10);

      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = boxW;
      photoCanvas.height = boxH;
      const pCtx = photoCanvas.getContext('2d')!;

      pCtx.drawImage(loadedImgs[idx], 0, 0, boxW, boxH);
      applyFilterToContext(pCtx, boxW, boxH, filter, settings.ditherStrength);

      ctx.drawImage(photoCanvas, pX, currentY);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;

      if (receiptStyle === 'korean_life4cuts') {
        drawRoundRect(ctx, pX, currentY, boxW, boxH, 12);
        ctx.stroke();
      } else {
        ctx.strokeRect(pX, currentY, boxW, boxH);
      }
    }
    currentY += boxH + 20;

  } else {
    // Vertical Photo Strip (3 or 4 photos)
    const photoWidth = canvasWidth - 60;
    for (let i = 0; i < loadedImgs.length; i++) {
      const pImg = loadedImgs[i];

      const photoCanvas = document.createElement('canvas');
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const pCtx = photoCanvas.getContext('2d')!;

      // Crop center fill
      const scale = Math.max(photoWidth / pImg.width, photoHeight / pImg.height);
      const sw = photoWidth / scale;
      const sh = photoHeight / scale;
      const sx = (pImg.width - sw) / 2;
      const sy = (pImg.height - sh) / 2;

      pCtx.drawImage(pImg, sx, sy, sw, sh, 0, 0, photoWidth, photoHeight);
      applyFilterToContext(pCtx, photoWidth, photoHeight, filter, settings.ditherStrength);

      ctx.drawImage(photoCanvas, leftX, currentY);

      // Frame Border according to Receipt Style
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;

      if (receiptStyle === 'korean_life4cuts') {
        drawRoundRect(ctx, leftX, currentY, photoWidth, photoHeight, 16);
        ctx.stroke();
        // Cute heart corner icon
        ctx.fillStyle = textColor;
        ctx.font = '14px "Courier New", Courier, monospace';
        ctx.fillText('♡', leftX + photoWidth - 18, currentY + 20);
      } else if (receiptStyle === 'magazine_cover') {
        ctx.strokeRect(leftX, currentY, photoWidth, photoHeight);
        // Editorial caption overlay
        ctx.fillStyle = paperColor;
        ctx.fillRect(leftX + 10, currentY + photoHeight - 28, 180, 20);
        ctx.fillStyle = textColor;
        ctx.font = 'bold 11px "Courier New", Courier, monospace';
        ctx.fillText(`EDITORIAL SHOT #${i + 1}`, leftX + 16, currentY + photoHeight - 14);
      } else if (receiptStyle === 'magazine_lookbook') {
        ctx.strokeRect(leftX, currentY, photoWidth, photoHeight);
        // Camera specs overlay
        ctx.fillStyle = textColor;
        ctx.fillRect(leftX, currentY, 120, 20);
        ctx.fillStyle = paperColor;
        ctx.font = 'bold 10px "Courier New", Courier, monospace';
        ctx.fillText(`CAM 35MM #${i + 1}`, leftX + 10, currentY + 14);
      } else if (receiptStyle === 'y2k_korean') {
        ctx.strokeRect(leftX, currentY, photoWidth, photoHeight);
        ctx.fillStyle = textColor;
        ctx.fillRect(leftX, currentY, 110, 20);
        ctx.fillStyle = paperColor;
        ctx.font = 'bold 10px "Courier New", Courier, monospace';
        ctx.fillText(`★ CYBER #${i + 1}`, leftX + 10, currentY + 14);
      } else {
        ctx.strokeRect(leftX, currentY, photoWidth, photoHeight);
        ctx.fillStyle = textColor;
        ctx.fillRect(leftX, currentY, 32, 22);
        ctx.fillStyle = paperColor;
        ctx.font = 'bold 12px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`#${i + 1}`, leftX + 16, currentY + 15);
      }

      currentY += photoHeight + 15;
    }
  }

  // Draw Selected Stickers on receipt
  if (selectedStickers.length > 0) {
    selectedStickers.forEach((stText, idx) => {
      const stampX = leftX + 80 + idx * 110;
      const stampY = currentY - 30;
      drawStickerStamp(ctx, stText, Math.min(stampX, rightX - 60), stampY, (idx % 2 === 0 ? -0.12 : 0.1));
    });
    currentY += 15;
  }

  // --- ITEMIZED RECEIPT SECTION ---
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.font = '14px "Courier New", Courier, monospace';
  ctx.fillText('----------------------------------------------------', canvasWidth / 2, currentY);
  currentY += 22;

  ctx.font = 'bold 13px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';

  if (receiptStyle === 'magazine_cover') {
    ctx.fillText('TABLE OF CONTENTS', leftX, currentY);
  } else if (receiptStyle === 'magazine_lookbook') {
    ctx.fillText('CREDITS & STYLING', leftX, currentY);
  } else if (receiptStyle === 'korean_life4cuts' || receiptStyle === 'korean_cafe') {
    ctx.fillText('영수증 (ITEM DETAILS)', leftX, currentY);
  } else if (receiptStyle === 'y2k_korean') {
    ctx.fillText('CYBER DATA ITEMS', leftX, currentY);
  } else {
    ctx.fillText('ITEMS BREAKDOWN', leftX, currentY);
  }

  ctx.textAlign = 'right';
  ctx.fillText('PRICE', rightX, currentY);
  currentY += 20;

  ctx.font = '12px "Courier New", Courier, monospace';
  let calculatedSubtotal = 0;

  items.forEach((item) => {
    ctx.textAlign = 'left';
    ctx.fillText(item.name, leftX, currentY);
    ctx.textAlign = 'right';
    ctx.fillText(item.price, rightX, currentY);
    currentY += 22;

    const numericPrice = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    calculatedSubtotal += numericPrice;
  });

  currentY += 5;
  ctx.textAlign = 'center';
  ctx.font = '14px "Courier New", Courier, monospace';
  ctx.fillText('----------------------------------------------------', canvasWidth / 2, currentY);
  currentY += 22;

  // Subtotal & Total
  ctx.font = '12px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('SUBTOTAL', leftX, currentY);
  ctx.textAlign = 'right';
  ctx.fillText(`${settings.currencySymbol}${calculatedSubtotal.toLocaleString('id-ID')}`, rightX, currentY);
  currentY += 20;

  ctx.textAlign = 'left';
  ctx.fillText('VIBE TAX (0%)', leftX, currentY);
  ctx.textAlign = 'right';
  ctx.fillText(`${settings.currencySymbol}0`, rightX, currentY);
  currentY += 22;

  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL PAID', leftX, currentY);
  ctx.textAlign = 'right';
  ctx.fillText(`${settings.currencySymbol}${calculatedSubtotal.toLocaleString('id-ID')}`, rightX, currentY);
  currentY += 25;

  ctx.font = '12px "Courier New", Courier, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('PAYMENT METHOD : QRIS / CASH (PAID)', leftX, currentY);
  currentY += 25;

  // --- VIBE RATING & MOTTO ---
  if (vibeRating || motto) {
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px "Courier New", Courier, monospace';
    if (vibeRating) {
      ctx.fillText(`[ VIBE SCORE: ${vibeRating} ]`, canvasWidth / 2, currentY);
      currentY += 20;
    }
    if (motto) {
      ctx.font = 'italic 12px "Courier New", Courier, monospace';
      ctx.fillText(`"${motto}"`, canvasWidth / 2, currentY);
      currentY += 22;
    }
  }

  // --- FOOTER SECTION BY STYLE ---
  ctx.textAlign = 'center';
  ctx.font = '14px "Courier New", Courier, monospace';
  ctx.fillText('====================================================', canvasWidth / 2, currentY);
  currentY += 25;

  // Barcode Graphic
  const barcodeWidth = canvasWidth - 120;
  drawBarcode(ctx, 60, currentY, barcodeWidth, 45);
  currentY += 55;

  // Barcode Code Payload
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.fillText(settings.barcodePayload || sessionCode, canvasWidth / 2, currentY);
  currentY += 24;

  // Footer Message
  ctx.font = '11px "Courier New", Courier, monospace';
  if (receiptStyle === 'korean_life4cuts') {
    ctx.fillText('♡ 감사합니다! 또 방문해주세요 ♡', canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText('SCAN QR CODE TO ACCESS DIGITAL GALLERY', canvasWidth / 2, currentY);
  } else if (receiptStyle === 'korean_cafe') {
    ctx.fillText('성수동 감성 스튜디오 • REVIEW EVENT COMPLETED', canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText('SCAN QR CODE FOR SOFTCOPY PHOTO & GIF', canvasWidth / 2, currentY);
  } else if (receiptStyle === 'magazine_cover') {
    ctx.fillText('ISSN 2026-8910 • GEN-Z MAGAZINE EDITORIAL', canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText('SCAN QR TO ACCESS DIGITAL COVER ARCHIVE', canvasWidth / 2, currentY);
  } else if (receiptStyle === 'magazine_lookbook') {
    ctx.fillText('PAGE 01 OF 01 • ESTETIK LOOKBOOK CATALOG', canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText('SCAN QR CODE FOR HD DIGITAL LOOKBOOK', canvasWidth / 2, currentY);
  } else {
    ctx.fillText(settings.footerNote, canvasWidth / 2, currentY);
    currentY += 18;
    ctx.fillText('SCAN QR CODE TO ACCESS DIGITAL GALLERY', canvasWidth / 2, currentY);
  }
  currentY += 35;

  // Bottom Tear Edge
  if (settings.paperTearStyle === 'zigzag') {
    drawZigzagEdge(ctx, canvasWidth, currentY - 20, 'bottom', paperColor);
  }

  return canvas.toDataURL('image/png');
}
