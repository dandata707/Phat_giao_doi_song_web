const TZ = 7;
const PI = Math.PI;
const INT = Math.floor;

const jdFromDate = (dd, mm, yy) => {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  return dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
};

const newMoon = (k) => {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  const s = (x) => Math.sin(dr * x);
  const C1 = (0.1734 - 0.000393 * T) * s(M) + 0.0021 * s(2 * M) - 0.4068 * s(Mpr) + 0.0161 * s(2 * Mpr) - 0.0004 * s(3 * Mpr)
    + 0.0104 * s(2 * F) - 0.0051 * s(M + Mpr) - 0.0074 * s(M - Mpr) + 0.0004 * s(2 * F + M) - 0.0004 * s(2 * F - M)
    - 0.0006 * s(2 * F + Mpr) + 0.001 * s(2 * F - Mpr) + 0.0005 * s(2 * Mpr + M);
  const dt = T < -11 ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - dt;
};

const newMoonDay = (k) => INT(newMoon(k) + 0.5 + TZ / 24);

const sunLongitude = (jdn) => {
  const T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L -= PI * 2 * INT(L / (PI * 2));
  return L;
};
const sunLong = (day) => INT((sunLongitude(day - 0.5 - TZ / 24) / PI) * 6);

const lunarMonth11 = (yy) => {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = newMoonDay(k);
  if (sunLong(nm) >= 9) nm = newMoonDay(k - 1);
  return nm;
};

const leapOffset = (a11) => {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0, i = 1;
  let arc = sunLong(newMoonDay(k + i));
  do { last = arc; i++; arc = sunLong(newMoonDay(k + i)); } while (arc !== last && i < 14);
  return i - 1;
};

export function solarToLunar(dd, mm, yy) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1);
  if (monthStart > dayNumber) monthStart = newMoonDay(k);
  let a11 = lunarMonth11(yy), b11 = a11, year;
  if (a11 >= monthStart) { year = yy; a11 = lunarMonth11(yy - 1); }
  else { year = yy + 1; b11 = lunarMonth11(yy + 1); }
  const day = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let leap = false, month = diff + 11;
  if (b11 - a11 > 365) {
    const ld = leapOffset(a11);
    if (diff >= ld) { month = diff + 10; if (diff === ld) leap = true; }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) year -= 1;
  return { day, month, year, leap };
}

const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
export const canChi = (y) => `${CAN[y % 10]} ${CHI[y % 12]}`;

export const WEEKDAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
export const pad = (n) => String(n).padStart(2, '0');

const EVENTS = [
  [1, 1, 'Tết Nguyên Đán', 0], [15, 1, 'Rằm tháng Giêng (Thượng nguyên)', 1], [8, 2, 'Vía Phật Thích Ca xuất gia', 2],
  [15, 2, 'Phật nhập Niết bàn', 3], [19, 2, 'Vía Quán Thế Âm Bồ Tát', 4], [15, 4, 'Đại lễ Phật đản', 5],
  [5, 5, 'Tết Đoan Ngọ', 0], [15, 7, 'Đại lễ Vu Lan', 1], [1, 9, 'Mùng 1 tháng 9 Âm lịch', 2],
  [9, 9, 'Tết Trùng Cửu', 3], [19, 9, 'Vía Quán Thế Âm xuất gia', 4], [8, 12, 'Ngày Phật thành đạo', 5],
];

export function buddhistEvents(year) {
  const out = [];
  for (let d = new Date(year, 0, 1); d.getFullYear() === year; d.setDate(d.getDate() + 1)) {
    const l = solarToLunar(d.getDate(), d.getMonth() + 1, year);
    const e = l.leap ? null : EVENTS.find((x) => x[0] === l.day && x[1] === l.month);
    if (e) out.push({ name: e[2], img: e[3], date: new Date(d), lunar: l });
  }
  return out;
}