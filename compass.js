// 罗盘逻辑与九宫飞星 - compass.js

/**
 * 八卦与方位对应表
 */
const BAGUA_DIRECTIONS = {
    '乾': { direction: '西北', degree: 315, element: '金', symbol: '☰' },
    '兑': { direction: '西', degree: 270, element: '金', symbol: '☱' },
    '离': { direction: '南', degree: 180, element: '火', symbol: '☲' },
    '震': { direction: '东', degree: 90, element: '木', symbol: '☳' },
    '巽': { direction: '东南', degree: 135, element: '木', symbol: '☴' },
    '坎': { direction: '北', degree: 0, element: '水', symbol: '☵' },
    '艮': { direction: '东北', degree: 45, element: '土', symbol: '☶' },
    '坤': { direction: '西南', degree: 225, element: '土', symbol: '☷' }
};

/**
 * 九宫飞星位置 (简化版洛书)
 * 1白贪狼星 - 北
 * 2黑巨门星 - 西南
 * 3碧禄存星 - 东
 * 4绿文曲星 - 东南
 * 5黄廉贞星 - 中宫
 * 6白武曲星 - 西北
 * 7赤破军星 - 西
 * 8白左辅星 - 东北
 * 9紫右弼星 - 南
 */
const JIUGONG_POSITIONS = [
    { number: 9, star: '右弼', direction: '南', element: '火' },
    { number: 5, star: '廉贞', direction: '中宫', element: '土' },
    { number: 7, star: '破军', direction: '西', element: '金' },
    { number: 1, star: '贪狼', direction: '北', element: '水' },
    { number: 3, star: '禄存', direction: '东', element: '木' },
    { number: 8, star: '左辅', direction: '东北', element: '土' },
    { number: 4, star: '文曲', direction: '东南', element: '木' },
    { number: 6, star: '武曲', direction: '西北', element: '金' },
    { number: 2, star: '巨门', direction: '西南', element: '水' }
];

/**
 * 计算罗盘指针角度
 * @param {string} yongshen - 用神五行
 * @returns {number} 角度值
 */
function calculateNeedleAngle(yongshen) {
    const angles = {
        '木': 90,   // 东
        '火': 180,  // 南
        '土': 225,  // 西南
        '金': 270,  // 西
        '水': 0     // 北
    };
    return angles[yongshen] || 0;
}

/**
 * 获取方位详细信息
 * @param {string} direction - 方位名称
 * @param {string} yongshen - 用神五行
 * @returns {Object} 方位信息
 */
function getDirectionDetail(direction, yongshen) {
    const directionInfo = {
        '东': {
            description: '日出之地，代表生长与活力。木性方位，利文昌，利事业进取。',
            goodFor: ['木行人', '宜学习', '利创业'],
            avoidFor: ['金行人', '体弱者']
        },
        '南': {
            description: '阳光充足之地，代表热情与礼仪。火性方位，利声名，利社交。',
            goodFor: ['火行人', '宜展示', '利外交'],
            avoidFor: ['水行人', '体弱者']
        },
        '西': {
            description: '日落之地，代表收敛与沉淀。金性方位，利财运，利肃杀。',
            goodFor: ['金行人', '宜理财', '利决策'],
            avoidFor: ['木行人', '体弱者']
        },
        '北': {
            description: '寒冷之地，代表收藏与潜伏。水性方位，利智谋，利沉寂。',
            goodFor: ['水行人', '宜思考', '利储备'],
            avoidFor: ['火行人', '体弱者']
        },
        '东南': {
            description: '旭日初升之地，代表温和与成长。木性方位，利文职，利人际关系。',
            goodFor: ['木行人', '宜交流', '利学习'],
            avoidFor: ['金行人', '体弱者']
        },
        '东北': {
            description: '阴阳交界之地，代表变化与转折。土性方位，利稳定，利守成。',
            goodFor: ['土行人', '宜守业', '利安全'],
            avoidFor: ['木行人', '体弱者']
        },
        '西南': {
            description: '阴气渐盛之地，代表包容与孕育。土性方位，利人缘，利储藏。',
            goodFor: ['土行人', '宜积累', '利人脉'],
            avoidFor: ['木行人', '体弱者']
        },
        '西北': {
            description: '乾天纯阳之地，代表创造与领导。金性方位，利开拓，利权威。',
            goodFor: ['金行人', '宜领导', '利创造'],
            avoidFor: ['火行人', '体弱者']
        }
    };

    return directionInfo[direction] || {
        description: '方位信息待补充',
        goodFor: [],
        avoidFor: []
    };
}

/**
 * 分析方位吉凶
 * @param {string} direction - 方位名称
 * @param {string} yongshen - 用神五行
 * @param {string} strength - 日主强弱
 * @returns {Object} 吉凶分析
 */
function analyzeDirectionAuspicious(direction, yongshen, strength) {
    const directionWuxing = {
        '东': '木', '南': '火', '西': '金', '北': '水',
        '东南': '木', '西南': '土', '东北': '土', '西北': '金'
    };

    const element = directionWuxing[direction];
    const isStrong = strength === 'strong';

    let status = 'neutral';
    let description = '';

    // 用神需要生助
    if (!isStrong) {
        if (element === yongshen) {
            status = 'auspicious';
            description = `${element}方助命主五行，运势增强`;
        } else if (
            (yongshen === '木' && element === '水') ||
            (yongshen === '火' && element === '木') ||
            (yongshen === '土' && element === '火') ||
            (yongshen === '金' && element === '土') ||
            (yongshen === '水' && element === '金')
        ) {
            status = 'auspicious';
            description = `${element}方相生助运，贵人方位`;
        } else {
            status = 'inauspicious';
            description = `${element}方泄气耗力，不利发展`;
        }
    } else {
        // 用神需要克泄
        if (element === yongshen) {
            status = 'inauspicious';
            description = `${element}方过旺为忌，谨慎前往`;
        } else if (
            (yongshen === '木' && element === '金') ||
            (yongshen === '火' && element === '水') ||
            (yongshen === '土' && element === '木') ||
            (yongshen === '金' && element === '火') ||
            (yongshen === '水' && element === '土')
        ) {
            status = 'auspicious';
            description = `${element}方克泄平衡，吉利方位`;
        } else {
            status = 'neutral';
            description = `${element}方气场平和，寻常可往`;
        }
    }

    return { status, description, element };
}

/**
 * 九宫飞星计算 (简化版)
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Array} 九宫飞星位置
 */
function calculateFlyingStars(year, month) {
    // 简化计算：按年紫白入中宫飞行
    const baseYear = 2024;
    const baseStars = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // 年紫白
    const yearMod = (year - baseYear) % 9;
    const zibai = yearMod === 0 ? 9 : yearMod;

    // 月紫白 (简化)
    const monthMod = (month - 1) % 9;
    const monthZibai = monthMod === 0 ? 9 : monthMod;

    // 生成九宫飞星
    const palace = [];
    for (let i = 0; i < 9; i++) {
        const pos = (zibai - 1 + i) % 9 + 1;
        palace.push({
            position: i + 1,
            star: getStarName(pos),
            direction: getPositionDirection(i + 1),
            element: getStarElement(pos)
        });
    }

    return palace;
}

/**
 * 获取星曜名称
 */
function getStarName(number) {
    const stars = {
        1: '贪狼', 2: '巨门', 3: '禄存',
        4: '文曲', 5: '廉贞', 6: '武曲',
        7: '破军', 8: '左辅', 9: '右弼'
    };
    return stars[number] || '不明';
}

/**
 * 获取方位
 */
function getPositionDirection(position) {
    const directions = {
        1: '北', 2: '西南', 3: '东',
        4: '东南', 5: '中宫', 6: '西北',
        7: '西', 8: '东北', 9: '南'
    };
    return directions[position];
}

/**
 * 获取星曜五行
 */
function getStarElement(number) {
    const elements = {
        1: '水', 2: '土', 3: '木',
        4: '木', 5: '土', 6: '金',
        7: '金', 8: '土', 9: '火'
    };
    return elements[number];
}

/**
 * 获取星曜吉凶
 */
function getStarAuspicious(number) {
    const auspicious = [1, 4, 8, 9]; // 贪狼、文曲、左辅、右弼
    const neutral = [5, 6]; // 廉贞、武曲
    const inauspicious = [2, 3, 7]; // 巨门、禄存、破军

    if (auspicious.includes(number)) return '吉';
    if (neutral.includes(number)) return '平';
    return '凶';
}

/**
 * 罗盘UI渲染
 */
class CompassRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentAngle = 0;
    }

    render(yongshen) {
        if (!this.container) return;

        const angle = calculateNeedleAngle(yongshen);
        this.currentAngle = angle;

        this.container.innerHTML = `
            <div class="compass">
                <div class="compass-inner"></div>
                <div class="compass-direction east">东</div>
                <div class="compass-direction south">南</div>
                <div class="compass-direction west">西</div>
                <div class="compass-direction north">北</div>
                <div class="compass-needle" style="--needle-angle: ${angle}deg"></div>
                <div class="compass-center"></div>
            </div>
        `;

        // 添加动态效果
        setTimeout(() => {
            const needle = this.container.querySelector('.compass-needle');
            if (needle) {
                needle.style.transform = `translate(-50%, 0) rotate(${angle}deg)`;
            }
        }, 100);
    }

    updateNeedle(yongshen) {
        const angle = calculateNeedleAngle(yongshen);
        const needle = this.container.querySelector('.compass-needle');
        if (needle) {
            needle.style.setProperty('--needle-angle', `${angle}deg`);
            needle.style.transform = `translate(-50%, 0) rotate(${angle}deg)`;
        }
    }
}

/**
 * 方位卡片渲染
 */
function renderDirectionCards(directions, yongshen, strength) {
    const directionOrder = ['东', '南', '西', '北', '东南', '东北', '西南', '西北'];

    return directionOrder.map(dir => {
        const detail = analyzeDirectionAuspicious(dir, yongshen, strength);
        const info = getDirectionDetail(dir, yongshen);

        const statusClass = detail.status === 'auspicious' ? 'auspicious' :
                           detail.status === 'inauspicious' ? 'inauspicious' : 'neutral';
        const statusText = detail.status === 'auspicious' ? '吉利' :
                          detail.status === 'inauspicious' ? '慎入' : '平常';
        const statusLabelClass = detail.status === 'auspicious' ? 'good' :
                                 detail.status === 'inauspicious' ? 'bad' : 'neutral';

        return `
            <div class="direction-card ${statusClass}">
                <h3><span class="symbol">${getDirectionSymbol(dir)}</span>${dir}</h3>
                <span class="status ${statusLabelClass}">${statusText}</span>
                <p>${detail.description}</p>
                <p style="margin-top:8px;font-size:0.9rem;">五行:${detail.element}</p>
            </div>
        `;
    }).join('');
}

/**
 * 获取方位符号
 */
function getDirectionSymbol(direction) {
    const symbols = {
        '东': '☀️', '南': '🔥', '西': '🌙', '北': '❄️',
        '东南': '🌅', '东北': '🌄', '西南': '🌆', '西北': '🏔️'
    };
    return symbols[direction] || '📍';
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BAGUA_DIRECTIONS,
        JIUGONG_POSITIONS,
        calculateNeedleAngle,
        getDirectionDetail,
        analyzeDirectionAuspicious,
        calculateFlyingStars,
        getStarName,
        getStarAuspicious,
        CompassRenderer,
        renderDirectionCards,
        getDirectionSymbol
    };
}