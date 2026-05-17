/**
 * 八字排盘算法 - 风水罗盘版
 * 支持阳历和农历输入
 */

// 天干地支常量
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const WU_XING = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};
const DIZHI_WUXING = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
};
const SHENGXIAO = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
    '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
    '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
};

// 农历数据
const LUNAR_INFO = {
  1900: 0x04bd8, 1901: 0x04ae0, 1902: 0x0a570, 1903: 0x054d5, 1904: 0x0d260, 1905: 0x0d950, 1906: 0x16554, 1907: 0x056a0, 1908: 0x09ad0, 1909: 0x095d0,
  1910: 0x149af, 1911: 0x04974, 1912: 0x0a4b0, 1913: 0x0b250, 1914: 0x16556, 1915: 0x056a0, 1916: 0x1aad0, 1917: 0x0b250, 1918: 0x052d0, 1919: 0x0a9b0, 1920: 0x0b950, 1921: 0x16554, 1922: 0x056a0, 1923: 0x16aa0, 1924: 0x05ad0, 1925: 0x0a2d0, 1926: 0x0b950, 1927: 0x16556, 1928: 0x04d60, 1929: 0x0d560, 1930: 0x0d950, 1931: 0x16a98, 1932: 0x056d0, 1933: 0x055d4, 1934: 0x0dac0, 1935: 0x0d560, 1936: 0x15590, 1937: 0x0d950, 1938: 0x15aa0, 1939: 0x0b5a0, 1940: 0x056a0, 1941: 0x1a6a0, 1942: 0x0a570, 1943: 0x054d5, 1944: 0x0d260, 1945: 0x0e950, 1946: 0x16554, 1947: 0x056a0, 1948: 0x1a9d0, 1949: 0x095d0, 1950: 0x149af, 1951: 0x04974, 1952: 0x0a4b0, 1953: 0x0b250, 1954: 0x16556, 1955: 0x056a0, 1956: 0x16aa0, 1957: 0x05ad0, 1958: 0x0a2d0, 1959: 0x0b950, 1960: 0x16556, 1961: 0x04d60, 1962: 0x0d560, 1963: 0x0d950, 1964: 0x16a98, 1965: 0x056d0, 1966: 0x055d4, 1967: 0x0dac0, 1968: 0x0d560, 1969: 0x15590, 1970: 0x0d950, 1971: 0x15aa0, 1972: 0x0b5a0, 1973: 0x056a0, 1974: 0x1a6a0, 1975: 0x0a570, 1976: 0x054d5, 1977: 0x0d260, 1978: 0x0e950, 1979: 0x16554, 1980: 0x056a0, 1981: 0x1a9d0, 1982: 0x095d0, 1983: 0x149af, 1984: 0x04974, 1985: 0x0a4b0, 1986: 0x0b250, 1987: 0x16556, 1988: 0x056a0, 1989: 0x16aa0, 1990: 0x05ad0, 1991: 0x0a2d0, 1992: 0x0b950, 1993: 0x16556, 1994: 0x04d60, 1995: 0x0d560, 1996: 0x0d950, 1997: 0x16a98, 1998: 0x056d0, 1999: 0x055d4, 2000: 0x0dac0, 2001: 0x0d560, 2002: 0x15590, 2003: 0x0d950, 2004: 0x15aa0, 2005: 0x0b5a0, 2006: 0x056a0, 2007: 0x1a6a0, 2008: 0x0a570, 2009: 0x054d5, 2010: 0x0d260, 2011: 0x0d950, 2012: 0x16554, 2013: 0x056a0, 2014: 0x1a9d0, 2015: 0x095d0, 2016: 0x149af, 2017: 0x04974, 2018: 0x0a4b0, 2019: 0x0b250, 2020: 0x16556, 2021: 0x056a0, 2022: 0x16aa0, 2023: 0x05ad0, 2024: 0x0a2d0, 2025: 0x0b950, 2026: 0x16556, 2027: 0x04d60, 2028: 0x0d560, 2029: 0x0d950, 2030: 0x16a98, 2031: 0x056d0, 2032: 0x055d4, 2033: 0x0dac0, 2034: 0x0d560, 2035: 0x15590, 2036: 0x0d950, 2037: 0x15aa0, 2038: 0x0b5a0, 2039: 0x056a0, 2040: 0x1a6a0, 2041: 0x0a570, 2042: 0x054d5, 2043: 0x0d260, 2044: 0x0e950, 2045: 0x16554, 2046: 0x056a0, 2047: 0x1a9d0, 2048: 0x095d0, 2049: 0x149af, 2050: 0x04974, 2051: 0x0a4b0, 2052: 0x0b250, 2053: 0x16556, 2054: 0x056a0, 2055: 0x16aa0, 2056: 0x05ad0, 2057: 0x0a2d0, 2058: 0x0b950, 2059: 0x16556, 2060: 0x04d60, 2061: 0x0d560, 2062: 0x0d950, 2063: 0x16a98, 2064: 0x056d0, 2065: 0x055d4, 2066: 0x0dac0, 2067: 0x0d560, 2068: 0x15590, 2069: 0x0d950, 2070: 0x15aa0, 2071: 0x0b5a0, 2072: 0x056a0, 2073: 0x1a6a0, 2074: 0x0a570, 2075: 0x054d5, 2076: 0x0d260, 2077: 0x0e950, 2078: 0x16554, 2079: 0x056a0, 2080: 0x1a9d0, 2081: 0x095d0, 2082: 0x149af, 2083: 0x04974, 2084: 0x0a4b0, 2085: 0x0b250, 2086: 0x16556, 2087: 0x056a0, 2088: 0x16aa0, 2089: 0x05ad0, 2090: 0x0a2d0, 2091: 0x0b950, 2092: 0x16556, 2093: 0x04d60, 2094: 0x0d560, 2095: 0x0d950, 2096: 0x16a98, 2097: 0x056d0, 2098: 0x055d4, 2099: 0x0dac0, 2100: 0x0d560
};

/**
 * 农历转阳历
 */
function lunarToSolar(year, month, day, isLeapMonth = false) {
  const yearInfo = LUNAR_INFO[year];
  if (!yearInfo) return null;

  const leapMonth = (yearInfo >> 12) & 0x0F;
  const leapDays = (yearInfo >> 16) & 0x0F;
  const monthDaysInfo = yearInfo & 0xFFFF;

  let days = 0;
  for (let m = 1; m < month; m++) {
    days += (monthDaysInfo >> (m - 1)) & 1 ? 30 : 29;
  }

  if (isLeapMonth && leapMonth === month) {
    days += leapDays === 15 ? 30 : 29;
  }

  days += day;

  const baseDate = new Date(year, 0, 31);
  const springFestivalOffset = 4;
  const solarDate = new Date(baseDate.getTime() + (days + springFestivalOffset - 1) * 24 * 60 * 60 * 1000);

  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth() + 1,
    day: solarDate.getDate()
  };
}

/**
 * 阳历转农历
 */
function solarToLunar(year, month, day) {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

  let lunarYear = 1900;
  let daysInYear = 0;

  while (lunarYear < 2100 && offset > 0) {
    const yearInfo = LUNAR_INFO[lunarYear];
    if (!yearInfo) break;

    daysInYear = 0;
    for (let m = 1; m <= 12; m++) {
      daysInYear += (yearInfo >> (m - 1)) & 1 ? 30 : 29;
    }
    const leapMonth = (yearInfo >> 12) & 0x0F;
    if (leapMonth > 0) {
      daysInYear += (yearInfo >> 16) & 0x0F === 15 ? 30 : 29;
    }

    if (offset >= daysInYear) {
      offset -= daysInYear;
      lunarYear++;
    } else {
      break;
    }
  }

  if (offset <= 0) {
    lunarYear--;
    offset += daysInYear;
  }

  const yearInfo = LUNAR_INFO[lunarYear];
  if (!yearInfo) return null;

  let lunarMonth = 1;
  let isLeapMonth = false;
  const leapMonth = (yearInfo >> 12) & 0x0F;

  for (let m = 1; m <= 12; m++) {
    const monthDays = (yearInfo >> (m - 1)) & 1 ? 30 : 29;
    if (offset < monthDays) {
      lunarMonth = m;
      break;
    }
    offset -= monthDays;

    if (m === leapMonth && !isLeapMonth) {
      const leapMonthDays = (yearInfo >> 16) & 0x0F === 15 ? 30 : 29;
      if (offset < leapMonthDays) {
        isLeapMonth = true;
        lunarMonth = m;
        break;
      }
      offset -= leapMonthDays;
    }
  }

  return {
    year: lunarYear,
    month: lunarMonth,
    day: offset + 1,
    isLeapMonth
  };
}

/**
 * 计算八字
 */
function calculateBaZi(year, month, day, hour, calendarType = 'solar', isLeapMonth = false) {
  let solarYear = year;
  let solarMonth = month;
  let solarDay = day;

  if (calendarType === 'lunar') {
    const solar = lunarToSolar(year, month, day, isLeapMonth);
    if (solar) {
      solarYear = solar.year;
      solarMonth = solar.month;
      solarDay = solar.day;
    }
  }

  // 年柱
  const yearGanIndex = ((solarYear - 1900) % 10 + 10) % 10;
  const yearZhiIndex = ((solarYear - 1900) % 12 + 12) % 12;
  const yearGan = TIAN_GAN[yearGanIndex];
  const yearZhi = DI_ZHI[yearZhiIndex];

  // 月柱
  const monthZhiArr = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const monthZhi = monthZhiArr[(solarMonth - 1) % 12];

  let startGan = 0;
  if (yearGan === '甲' || yearGan === '乙') startGan = 0;
  else if (yearGan === '丙' || yearGan === '丁') startGan = 2;
  else if (yearGan === '戊' || yearGan === '己') startGan = 4;
  else if (yearGan === '庚' || yearGan === '辛') startGan = 6;
  else startGan = 8;

  const monthGan = TIAN_GAN[(startGan + solarMonth - 1) % 10];

  // 日柱
  const baseYear = 2000;
  const baseMonth = 1;
  const baseDay = 1;
  const baseGan = 6;
  const baseZhi = 0;

  let days = 0;
  for (let y = baseYear; y < solarYear; y++) {
    days += (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 366 : 365;
  }
  for (let m = 1; m < solarMonth; m++) {
    days += [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
    if (m === 2 && ((solarYear % 4 === 0 && solarYear % 100 !== 0) || solarYear % 400 === 0)) days++;
  }
  days += solarDay - 1;

  const dayGanIndex = (baseGan + days) % 10;
  const dayZhiIndex = (baseZhi + days) % 12;
  const dayGan = TIAN_GAN[dayGanIndex];
  const dayZhi = DI_ZHI[dayZhiIndex];

  // 时柱
  const hourZhiIndex = Math.floor(hour / 2) % 12;
  const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
  const hourGan = TIAN_GAN[hourGanIndex];
  const hourZhi = DI_ZHI[hourZhiIndex];

  return {
    year: { gan: yearGan, zhi: yearZhi, wuxing: WU_XING[yearGan] },
    month: { gan: monthGan, zhi: monthZhi, wuxing: WU_XING[monthGan] },
    day: { gan: dayGan, zhi: dayZhi, wuxing: WU_XING[dayGan] },
    hour: { gan: hourGan, zhi: hourZhi, wuxing: WU_XING[hourGan] }
  };
}

/**
 * 计算五行强度
 */
function calculateWuxingStrength(bazi) {
    const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

    Object.values(bazi).forEach(item => {
        if (item.wuxing) counts[item.wuxing]++;
    });

    const cangGan = {
        '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
        '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
        '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
        '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
    };

    Object.values(bazi).forEach(item => {
        const cang = cangGan[item.zhi] || [];
        cang.forEach(g => {
            if (WU_XING[g]) counts[WU_XING[g]] += 0.5;
        });
    });

    return counts;
}

/**
 * 分析日主强弱，确定用神
 */
function analyzeDayMaster(bazi) {
    const wuxing = calculateWuxingStrength(bazi);
    const dayElement = bazi.day.wuxing;

    const sameCount = wuxing[dayElement] || 0;
    const generateCount = (dayElement === '木') ? (wuxing['水'] || 0) :
                          (dayElement === '火') ? (wuxing['木'] || 0) :
                          (dayElement === '土') ? (wuxing['火'] || 0) :
                          (dayElement === '金') ? (wuxing['土'] || 0) :
                          (wuxing['金'] || 0);

    const totalSupport = sameCount + generateCount;

    const controlCount = (dayElement === '木') ? (wuxing['金'] || 0) :
                         (dayElement === '火') ? (wuxing['水'] || 0) :
                         (dayElement === '土') ? (wuxing['木'] || 0) :
                         (dayElement === '金') ? (wuxing['火'] || 0) :
                         (wuxing['土'] || 0);

    const destructCount = (dayElement === '木') ? (wuxing['土'] || 0) :
                          (dayElement === '火') ? (wuxing['金'] || 0) :
                          (dayElement === '土') ? (wuxing['水'] || 0) :
                          (dayElement === '金') ? (wuxing['木'] || 0) :
                          (wuxing['火'] || 0);

    const totalAttack = controlCount + destructCount;

    let strength = 'neutral';
    let yongshen = dayElement;

    if (totalSupport >= totalAttack + 2) {
        strength = 'strong';
        if (dayElement === '木') yongshen = '金';
        else if (dayElement === '火') yongshen = '水';
        else if (dayElement === '土') yongshen = '木';
        else if (dayElement === '金') yongshen = '火';
        else yongshen = '土';
    } else if (totalAttack >= totalSupport + 2) {
        strength = 'weak';
        if (dayElement === '木') yongshen = '水';
        else if (dayElement === '火') yongshen = '木';
        else if (dayElement === '土') yongshen = '火';
        else if (dayElement === '金') yongshen = '土';
        else yongshen = '金';
    }

    return { dayElement, strength, yongshen, wuxingCounts: wuxing, totalSupport, totalAttack };
}

/**
 * 获取用神对应的有利方位
 */
function getAuspiciousDirections(yongshen) {
    const elementDirections = {
        '木': { '东': '大吉', '东南': '吉', '南': '平', '西南': '平', '西': '凶', '西北': '平', '北': '平', '东北': '吉' },
        '火': { '东': '吉', '东南': '吉', '南': '大吉', '西南': '平', '西': '凶', '西北': '凶', '北': '平', '东北': '平' },
        '土': { '东': '平', '东南': '凶', '南': '吉', '西南': '大吉', '西': '吉', '西北': '吉', '北': '平', '东北': '大吉' },
        '金': { '东': '凶', '东南': '平', '南': '凶', '西南': '吉', '西': '大吉', '西北': '大吉', '北': '平', '东北': '平' },
        '水': { '东': '平', '东南': '平', '南': '平', '西南': '凶', '西': '凶', '西北': '平', '北': '大吉', '东北': '凶' }
    };

    return elementDirections[yongshen] || elementDirections['木'];
}

/**
 * 获取八卦信息
 */
function getBaGuaInfo() {
    return [
        { gua: '☰', name: '乾', element: '金', direction: '西北', nature: '天', number: 1 },
        { gua: '☱', name: '兑', element: '金', direction: '西', nature: '泽', number: 2 },
        { gua: '☲', name: '离', element: '火', direction: '南', nature: '火', number: 3 },
        { gua: '☴', name: '巽', element: '木', direction: '东南', nature: '风', number: 4 },
        { gua: '☵', name: '坎', element: '水', direction: '北', nature: '水', number: 5 },
        { gua: '☶', name: '艮', element: '土', direction: '东北', nature: '山', number: 6 },
        { gua: '☷', name: '坤', element: '土', direction: '西南', nature: '地', number: 7 },
        { gua: '☳', name: '震', element: '木', direction: '东', nature: '雷', number: 8 }
    ];
}

/**
 * 获取家居摆放建议
 */
function getPlacementAdvice(yongshen, strength) {
    const isStrong = strength === 'strong';
    return {
        bed: {
            good: isStrong ? '东、东南、北' : '西、西南、西北',
            avoid: isStrong ? '南' : '东、东南',
            reason: isStrong ? '宜静制动，安睡养神' : '宜生助旺气，促进睡眠'
        },
        desk: {
            good: isStrong ? '北、东、东南' : '南、西南',
            avoid: isStrong ? '西、西北' : '北、东',
            reason: isStrong ? '利学习进取，催旺事业' : '利贵人相助，提升运势'
        },
        stove: {
            good: isStrong ? '北、东、东南' : '南、西南、西北',
            avoid: isStrong ? '南' : '东、东南',
            reason: isStrong ? '以水制火，平衡气场' : '火生土旺，助运护宅'
        }
    };
}

/**
 * 获取颜色建议
 */
function getColorSuggestions(yongshen, strength) {
    const isStrong = strength === 'strong';
    const colors = {
        '木': {
            good: isStrong ? [
                { name: '白色', hex: '#FFFFFF' },
                { name: '银色', hex: '#C0C0C0' },
                { name: '浅灰', hex: '#D3D3D3' }
            ] : [
                { name: '绿色', hex: '#228B22' },
                { name: '青色', hex: '#00CED1' },
                { name: '蓝色', hex: '#4169E1' }
            ]
        },
        '火': {
            good: isStrong ? [
                { name: '白色', hex: '#FFFFFF' },
                { name: '金色', hex: '#FFD700' },
                { name: '银色', hex: '#C0C0C0' }
            ] : [
                { name: '红色', hex: '#DC143C' },
                { name: '紫色', hex: '#8B008B' },
                { name: '橙色', hex: '#FF8C00' }
            ]
        },
        '土': {
            good: isStrong ? [
                { name: '绿色', hex: '#228B22' },
                { name: '青色', hex: '#00CED1' },
                { name: '蓝色', hex: '#4169E1' }
            ] : [
                { name: '黄色', hex: '#FFD700' },
                { name: '棕色', hex: '#8B4513' },
                { name: '米色', hex: '#F5F5DC' }
            ]
        },
        '金': {
            good: isStrong ? [
                { name: '红色', hex: '#DC143C' },
                { name: '紫色', hex: '#8B008B' },
                { name: '橙色', hex: '#FF8C00' }
            ] : [
                { name: '白色', hex: '#FFFFFF' },
                { name: '金色', hex: '#FFD700' },
                { name: '银色', hex: '#C0C0C0' }
            ]
        },
        '水': {
            good: isStrong ? [
                { name: '绿色', hex: '#228B22' },
                { name: '黄色', hex: '#FFD700' },
                { name: '棕色', hex: '#8B4513' }
            ] : [
                { name: '蓝色', hex: '#4169E1' },
                { name: '黑色', hex: '#1C1C1C' },
                { name: '白色', hex: '#FFFFFF' }
            ]
        }
    };
    return colors[yongshen] || colors['木'];
}

/**
 * 获取数字建议
 */
function getNumberSuggestions(yongshen, strength) {
    const isStrong = strength === 'strong';
    const numbers = {
        '木': isStrong ? [7, 8, 9] : [3, 4, 5],
        '火': isStrong ? [6, 7, 8] : [2, 3, 4],
        '土': isStrong ? [1, 2, 3] : [5, 6, 7],
        '金': isStrong ? [2, 3, 4] : [6, 7, 8],
        '水': isStrong ? [5, 6, 7] : [1, 2, 3]
    };
    return numbers[yongshen] || numbers['木'];
}

// 导出
window.BaZiCalculator = {
    calculateBaZi,
    analyzeDayMaster,
    getAuspiciousDirections,
    getBaGuaInfo,
    getPlacementAdvice,
    getColorSuggestions,
    getNumberSuggestions,
    solarToLunar,
    lunarToSolar,
    LUNAR_INFO,
    TIAN_GAN,
    DI_ZHI,
    WU_XING,
    DIZHI_WUXING,
    SHENGXIAO
};