export type TicketInput = {
  participant: {
    firstName: string;
    lastName: string;
    registrationNumber: string;
    profile: string;
    institution?: string | null;
  };
  edition: {
    name: string;
    dateText: string;
    location: string;
  };
  qrCodeDataUrl: string;
};

const WIDTH = 1000;
const HEIGHT = 1500;
const NAVY = '#0D3358';
const TEAL = '#1A9BA1';
const INK = '#0f172a';
const MUTED = '#64748b';
const BORDER = '#e2e8f0';

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function topRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number
) {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Impossible de charger le QR code.'));
    image.src = src;
  });
}

async function ensureFontsLoaded() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('400 16px Montserrat'),
      document.fonts.load('500 16px Montserrat'),
      document.fonts.load('600 16px Montserrat'),
      document.fonts.load('700 16px Montserrat'),
      document.fonts.load('800 16px Montserrat'),
    ]);
    await document.fonts.ready;
  } catch {
    // Ignore font loading errors and fallback to system fonts
  }
}

const FONT_BODY = 'Montserrat, Arial, sans-serif';
const FONT_LABEL = 'Arial, sans-serif';
const FONT_MONO = 'Courier New, monospace';

export async function buildTicketCanvas(data: TicketInput): Promise<HTMLCanvasElement> {
  if (!data.qrCodeDataUrl) throw new Error('QR code indisponible.');

  await ensureFontsLoaded();

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponible.');

  const qrImage = await loadImage(data.qrCodeDataUrl);

  ctx.fillStyle = '#eef2f7';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const x = 50;
  const y = 50;
  const width = WIDTH - 100;
  const height = HEIGHT - 100;

  ctx.save();
  ctx.shadowColor = 'rgba(13, 51, 88, 0.16)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#ffffff';
  roundedRect(ctx, x, y, width, height, 42);
  ctx.fill();
  ctx.restore();

  ctx.save();
  topRoundedRect(ctx, x, y, width, 300, 42);
  ctx.clip();
  ctx.fillStyle = NAVY;
  ctx.fillRect(x, y, width, 300);
  ctx.fillStyle = TEAL;
  ctx.beginPath();
  ctx.arc(x + width - 130, y + 130, 170, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.arc(x + width - 40, y + 245, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = TEAL;
  ctx.fillRect(x, y + 300, width, 10);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.font = `600 22px ${FONT_BODY}`;
  ctx.fillText('IGE · INNOVATION EN GÉNIE ÉLECTRIQUE', x + 55, y + 78);

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 46px ${FONT_BODY}`;
  const titleLines = wrapText(ctx, data.edition.name, 600).slice(0, 2);
  drawLines(ctx, titleLines, x + 55, y + 150, 54);

  const pillY = titleLines.length > 1 ? y + 262 : y + 226;
  ctx.fillStyle = TEAL;
  roundedRect(ctx, x + 55, pillY, 230, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 20px ${FONT_BODY}`;
  ctx.textAlign = 'center';
  ctx.fillText('PASS PARTICIPANT', x + 55 + 115, pillY + 31);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 26px ${FONT_BODY}`;
  ctx.textAlign = 'right';
  ctx.fillText('JE-GE', x + width - 55, y + 80);
  ctx.font = `500 17px ${FONT_BODY}`;
  ctx.fillText(data.edition.dateText, x + width - 55, y + 111);
  ctx.textAlign = 'left';

  let cursorY = y + 400;
  ctx.fillStyle = MUTED;
  ctx.font = `700 18px ${FONT_LABEL}`;
  ctx.fillText('NOM DU PARTICIPANT', x + 60, cursorY);

  cursorY += 58;
  ctx.fillStyle = INK;
  ctx.font = `800 48px ${FONT_BODY}`;
  const nameLines = wrapText(
    ctx,
    `${data.participant.firstName} ${data.participant.lastName}`.trim(),
    width - 120
  ).slice(0, 2);
  drawLines(ctx, nameLines, x + 60, cursorY, 54);

  cursorY += nameLines.length > 1 ? 100 : 58;
  ctx.fillStyle = '#f8fafc';
  roundedRect(ctx, x + 60, cursorY, width - 120, 76, 16);
  ctx.fill();
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 2;
  roundedRect(ctx, x + 60, cursorY, width - 120, 76, 16);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.font = `600 17px ${FONT_LABEL}`;
  ctx.fillText("NUMÉRO D'INSCRIPTION", x + 86, cursorY + 30);
  ctx.fillStyle = INK;
  ctx.font = `700 28px ${FONT_MONO}`;
  ctx.fillText(data.participant.registrationNumber, x + 86, cursorY + 61);

  cursorY += 130;
  ctx.fillStyle = MUTED;
  ctx.font = `700 18px ${FONT_BODY}`;
  ctx.fillText('PROFIL', x + 60, cursorY);
  ctx.font = `700 18px ${FONT_LABEL}`;
  ctx.fillText('INSTITUTION', x + 420, cursorY);

  cursorY += 38;
  ctx.fillStyle = INK;
  ctx.font = `600 26px ${FONT_BODY}`;
  drawLines(ctx, wrapText(ctx, data.participant.profile || '—', 320).slice(0, 2), x + 60, cursorY, 32);
  drawLines(
    ctx,
    wrapText(ctx, data.participant.institution || '—', 440).slice(0, 2),
    x + 420,
    cursorY,
    32
  );

  cursorY += 100;
  ctx.fillStyle = MUTED;
  ctx.font = `700 18px ${FONT_LABEL}`;
  ctx.fillText('DATE', x + 60, cursorY);
  ctx.fillText('LIEU', x + 420, cursorY);

  cursorY += 38;
  ctx.fillStyle = INK;
  ctx.font = `600 26px ${FONT_BODY}`;
  drawLines(
    ctx,
    wrapText(ctx, data.edition.dateText || '—', 320).slice(0, 2),
    x + 60,
    cursorY,
    32
  );
  drawLines(
    ctx,
    wrapText(ctx, data.edition.location || '—', 440).slice(0, 2),
    x + 420,
    cursorY,
    32
  );

  const perforationY = y + 1070;
  ctx.save();
  ctx.fillStyle = '#eef2f7';
  ctx.beginPath();
  ctx.arc(x, perforationY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + width, perforationY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(x + 34, perforationY);
  ctx.lineTo(x + width - 34, perforationY);
  ctx.stroke();
  ctx.setLineDash([]);

  const qrSize = 220;
  const qrPadding = 12;
  const qrColumnLeft = x + 20;
  const qrColumnWidth = 400;
  const qrX = qrColumnLeft + qrPadding;
  const qrAreaTop = perforationY + 18;
  const qrAreaBottom = y + height - 58;
  const qrY =
    qrAreaTop +
    (qrAreaBottom - qrAreaTop - (qrSize + qrPadding * 2)) / 2 +
    qrPadding;

  ctx.fillStyle = '#ffffff';
  roundedRect(
    ctx,
    qrX - qrPadding,
    qrY - qrPadding,
    qrSize + qrPadding * 2,
    qrSize + qrPadding * 2,
    18
  );
  ctx.fill();
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 2;
  roundedRect(
    ctx,
    qrX - qrPadding,
    qrY - qrPadding,
    qrSize + qrPadding * 2,
    qrSize + qrPadding * 2,
    18
  );
  ctx.stroke();
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  const detailX = qrX + qrSize + 55;
  const detailWidth = x + width - detailX - 55;

  ctx.fillStyle = TEAL;
  ctx.font = `800 24px ${FONT_BODY}`;
  ctx.fillText("SCANNEZ À L'ENTRÉE", detailX, qrY + 40);

  ctx.fillStyle = INK;
  ctx.font = `600 21px ${FONT_BODY}`;
  drawLines(
    ctx,
    wrapText(
      ctx,
      "Présentez ce QR code à l'accueil pour vérifier votre pass.",
      detailWidth
    ),
    detailX,
    qrY + 80,
    29
  );

  ctx.fillStyle = MUTED;
  ctx.font = `600 16px ${FONT_BODY}`;
  ctx.fillText('Numéro de pass', detailX, qrY + 205);
  ctx.fillStyle = INK;
  ctx.font = `700 20px ${FONT_MONO}`;
  drawLines(
    ctx,
    wrapText(ctx, data.participant.registrationNumber, detailWidth),
    detailX,
    qrY + 235,
    26
  );

  ctx.fillStyle = MUTED;
  ctx.font = `500 16px ${FONT_BODY}`;
  ctx.textAlign = 'left';
  ctx.fillText('Pass personnel, non transférable.', qrX - qrPadding, qrY + qrSize + qrPadding * 2 + 28);
  ctx.textAlign = 'left';

  ctx.textAlign = 'right';
  ctx.fillStyle = TEAL;
  ctx.font = `800 20px ${FONT_BODY}`;
  ctx.fillText('ige-benin.org', x + width - 60, y + height - 32);
  ctx.textAlign = 'left';

  return canvas;
}

export async function downloadTicketPng(data: TicketInput) {
  const canvas = await buildTicketCanvas(data);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );

  if (!blob) throw new Error('Impossible de générer le ticket.');

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ticket-jege-${data.participant.registrationNumber}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
