// 主应用逻辑 - app.js
// 支持阳历和农历输入

let currentAnalysis = null;

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyze);
    }

    setDefaultDateValues();
    validateForm();

    // 监听历法切换
    const calendarType = document.getElementById('calendarType');
    if (calendarType) {
        calendarType.addEventListener('change', function() {
            const isLunar = this.value === 'lunar';
            document.getElementById('leapMonthGroup').style.display = isLunar ? '' : 'none';
            updateDayOptions();
        });
    }

    // 监听年份变化（更新闰月选项）
    const yearSelect = document.getElementById('year');
    if (yearSelect) {
        yearSelect.addEventListener('change', function() {
            updateLeapMonthOptions();
            updateDayOptions();
        });
    }

    // 监听月份变化
    const monthSelect = document.getElementById('month');
    if (monthSelect) {
        monthSelect.addEventListener('change', function() {
            updateDayOptions();
        });
    }
}

function updateLeapMonthOptions() {
    const year = parseInt(document.getElementById('year')?.value);
    const leapMonthSelect = document.getElementById('leapMonth');
    if (!leapMonthSelect || !year) return;

    leapMonthSelect.innerHTML = '<option value="">否</option>';

    const lunarInfo = window.BaZiCalculator.LUNAR_INFO[year];
    if (lunarInfo) {
        const leapMonth = (lunarInfo >> 12) & 0x0F;
        if (leapMonth > 0) {
            const months = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
            const opt = document.createElement('option');
            opt.value = 'leap_' + leapMonth;
            opt.textContent = '闰' + months[leapMonth - 1];
            leapMonthSelect.appendChild(opt);
        }
    }
}

function updateDayOptions() {
    const year = parseInt(document.getElementById('year')?.value);
    const month = parseInt(document.getElementById('month')?.value);
    const daySelect = document.getElementById('day');
    const calendarType = document.getElementById('calendarType')?.value;
    const leapMonthValue = document.getElementById('leapMonth')?.value;
    if (!daySelect || !year || !month) return;

    daySelect.innerHTML = '';
    let maxDays = 30;

    if (calendarType === 'lunar') {
        const lunarInfo = window.BaZiCalculator.LUNAR_INFO[year];
        if (lunarInfo) {
            const leapMonth = (lunarInfo >> 12) & 0x0F;
            const isLeapMonth = leapMonthValue.startsWith('leap_') && leapMonth === month;

            if (isLeapMonth) {
                maxDays = ((lunarInfo >> 16) & 0x0F) === 15 ? 30 : 29;
            } else {
                maxDays = (lunarInfo >> (month - 1)) & 1 ? 30 : 29;
            }
        }
    }

    for (let d = 1; d <= maxDays; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d + '日';
        daySelect.appendChild(opt);
    }
}

function setDefaultDateValues() {
    const today = new Date();
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const hourSelect = document.getElementById('hour');

    if (yearSelect) {
        const currentYear = today.getFullYear();
        for (let y = currentYear; y >= 1940; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y + '年';
            if (y === 1990) option.selected = true;
            yearSelect.appendChild(option);
        }
    }

    if (monthSelect) {
        for (let m = 1; m <= 12; m++) {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m + '月';
            if (m === 1) option.selected = true;
            monthSelect.appendChild(option);
        }
    }

    if (daySelect) {
        for (let d = 1; d <= 30; d++) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d + '日';
            if (d === 1) option.selected = true;
            daySelect.appendChild(option);
        }
    }

    if (hourSelect) {
        const hourNames = ['子时(23-01)', '丑时(01-03)', '寅时(03-05)', '卯时(05-07)',
                         '辰时(07-09)', '巳时(09-11)', '午时(11-13)', '未时(13-15)',
                         '申时(15-17)', '酉时(17-19)', '戌时(19-21)', '亥时(21-23)'];
        for (let h = 0; h < 24; h += 2) {
            const idx = Math.floor(h / 2);
            const option = document.createElement('option');
            option.value = h;
            option.textContent = hourNames[idx];
            if (h === 12) option.selected = true;
            hourSelect.appendChild(option);
        }
    }

    updateLeapMonthOptions();
}

function validateForm() {
    const inputs = document.querySelectorAll('.form-group input, .form-group select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            this.style.borderColor = '';
        });
    });
}

function handleAnalyze() {
    const calendarType = document.getElementById('calendarType')?.value || 'solar';
    const year = parseInt(document.getElementById('year')?.value);
    const month = parseInt(document.getElementById('month')?.value);
    const day = parseInt(document.getElementById('day')?.value);
    const hour = parseInt(document.getElementById('hour')?.value);
    const leapMonthValue = document.getElementById('leapMonth')?.value || '';
    const isLeapMonth = leapMonthValue.startsWith('leap_');

    if (!year || !month || !day || !hour) {
        alert('请完整填写出生信息');
        return;
    }

    showLoading(true);

    setTimeout(() => {
        performAnalysis(year, month, day, hour, isLeapMonth, calendarType);
        showLoading(false);
    }, 800);
}

function performAnalysis(year, month, day, hour, isLeapMonth, calendarType) {
    const bazi = window.BaZiCalculator.calculateBaZi(year, month, day, hour, calendarType, isLeapMonth);
    const analysis = window.BaZiCalculator.analyzeDayMaster(bazi);

    currentAnalysis = {
        bazi,
        analysis,
        year,
        month,
        day,
        hour,
        isLeapMonth,
        calendarType
    };

    displayResults(currentAnalysis);
}

function displayResults(data) {
    const { bazi, analysis } = data;

    displayBaZiInfo(bazi);
    displayBaGuaInfo();
    renderCompass(analysis.yongshen);
    displayDirections(analysis);
    displayAdvice(analysis);
    displaySuggestions(analysis);

    scrollToResults();
}

function displayBaZiInfo(bazi) {
    const section = document.getElementById('baziSection');
    if (!section) return;

    section.classList.add('active');

    const grid = section.querySelector('.bazi-grid');
    if (!grid) return;

    const dayGan = bazi.day.gan;
    const dayElement = bazi.day.wuxing;
    const strengthText = currentAnalysis.analysis.strength === 'strong' ? '身强' :
                        currentAnalysis.analysis.strength === 'weak' ? '身弱' : '中和';

    grid.innerHTML = `
        <div class="bazi-card">
            <h4>年柱</h4>
            <div class="value">${bazi.year.gan}${bazi.year.zhi}</div>
            <div class="label">${bazi.year.wuxing} | ${window.BaZiCalculator.SHENGXIAO[bazi.year.zhi]}肖</div>
        </div>
        <div class="bazi-card">
            <h4>月柱</h4>
            <div class="value">${bazi.month.gan}${bazi.month.zhi}</div>
            <div class="label">${bazi.month.wuxing}</div>
        </div>
        <div class="bazi-card">
            <h4>日柱</h4>
            <div class="value">${bazi.day.gan}${bazi.day.zhi}</div>
            <div class="label">${bazi.day.wuxing} | 日主</div>
        </div>
        <div class="bazi-card">
            <h4>时柱</h4>
            <div class="value">${bazi.hour.gan}${bazi.hour.zhi}</div>
            <div class="label">${bazi.hour.wuxing}</div>
        </div>
        <div class="bazi-card">
            <h4>命局</h4>
            <div class="value">${strengthText}</div>
            <div class="label">日主${dayGan}属${dayElement}</div>
        </div>
        <div class="bazi-card">
            <h4>用神</h4>
            <div class="value">${currentAnalysis.analysis.yongshen}</div>
            <div class="label">五行需${currentAnalysis.analysis.strength === 'strong' ? '克泄' : '生助'}</div>
        </div>
    `;
}

function displayBaGuaInfo() {
    const section = document.getElementById('baguaSection');
    if (!section) return;

    section.classList.add('active');

    const grid = section.querySelector('.bagua-grid');
    if (!grid) return;

    const baguaInfo = window.BaZiCalculator.getBaGuaInfo();
    const yongshen = currentAnalysis.analysis.yongshen;

    grid.innerHTML = baguaInfo.map(bagua => {
        const isFavorable = bagua.element === yongshen;
        return `
            <div class="bagua-item" style="${isFavorable ? 'border-color: #c9a227; background: #fffef9;' : ''}">
                <div class="gua">${bagua.gua}</div>
                <div class="name">${bagua.name}</div>
                <div class="element">${bagua.element}${isFavorable ? ' ★' : ''}</div>
                <div class="direction">${bagua.direction}</div>
            </div>
        `;
    }).join('');
}

function renderCompass(yongshen) {
    const section = document.getElementById('compassSection');
    if (!section) return;

    section.classList.add('active');

    const compassWrapper = section.querySelector('.compass-wrapper');
    if (!compassWrapper) return;

    const renderer = new CompassRenderer('compassContainer');
    renderer.render(yongshen);
}

function displayDirections(analysis) {
    const section = document.getElementById('compassSection');
    if (!section) return;

    const grid = section.querySelector('.directions-grid');
    if (!grid) return;

    const directions = window.BaZiCalculator.getAuspiciousDirections(analysis.yongshen);
    const cardsHtml = renderDirectionCards(directions, analysis.yongshen, analysis.strength);

    grid.innerHTML = cardsHtml;
}

function displayAdvice(analysis) {
    const section = document.getElementById('adviceSection');
    if (!section) return;

    section.classList.add('active');

    const grid = section.querySelector('.advice-grid');
    if (!grid) return;

    const advice = window.BaZiCalculator.getPlacementAdvice(analysis.yongshen, analysis.strength);

    grid.innerHTML = `
        <div class="advice-card">
            <h4>🛏️ 床位摆放</h4>
            <ul>
                <li>宜朝向：${advice.bed.good}</li>
                <li>忌朝向：${advice.bed.avoid}</li>
                <li>原因：${advice.bed.reason}</li>
                <li>建议床头靠墙，勿对门窗</li>
                <li>床下保持清洁，不堆杂物</li>
            </ul>
        </div>
        <div class="advice-card">
            <h4>📚 书桌/办公桌</h4>
            <ul>
                <li>宜朝向：${advice.desk.good}</li>
                <li>忌朝向：${advice.desk.avoid}</li>
                <li>原因：${advice.desk.reason}</li>
                <li>背后宜有实墙依靠，忌背窗</li>
                <li>桌面保持整洁，利思考</li>
            </ul>
        </div>
        <div class="advice-card">
            <h4>🔥 炉灶/厨房</h4>
            <ul>
                <li>宜朝向：${advice.stove.good}</li>
                <li>忌朝向：${advice.stove.avoid}</li>
                <li>原因：${advice.stove.reason}</li>
                <li>灶口忌对水槽，易起争拗</li>
                <li>厨房保持通风，光线充足</li>
            </ul>
        </div>
    `;
}

function displaySuggestions(analysis) {
    const section = document.getElementById('suggestionsSection');
    if (!section) return;

    section.classList.add('active');

    const grid = section.querySelector('.suggestions-grid');
    if (!grid) return;

    const colors = window.BaZiCalculator.getColorSuggestions(analysis.yongshen, analysis.strength);
    const numbers = window.BaZiCalculator.getNumberSuggestions(analysis.yongshen, analysis.strength);

    grid.innerHTML = `
        <div class="suggestion-card">
            <h4>🎨 颜色搭配建议</h4>
            <div class="color-list">
                ${colors.good.map(c => `
                    <div class="color-item">
                        <div class="color-box" style="background-color: ${c.hex}"></div>
                        <span>${c.name}</span>
                    </div>
                `).join('')}
            </div>
            <p style="margin-top:15px;color:var(--light-text);font-size:0.9rem;">
                喜用色宜多使用，忌用色尽量避免大面积使用
            </p>
        </div>
        <div class="suggestion-card">
            <h4>🔢 吉利数字</h4>
            <div class="number-list">
                ${numbers.map(n => `
                    <span class="number-item">${n}</span>
                `).join('')}
            </div>
            <p style="margin-top:15px;color:var(--light-text);font-size:0.9rem;">
                数字与手机号、车牌号、楼层选择等
            </p>
        </div>
    `;
}

function showLoading(show) {
    const loading = document.querySelector('.loading');
    const btn = document.getElementById('analyzeBtn');

    if (loading) {
        loading.classList.toggle('active', show);
    }

    if (btn) {
        btn.disabled = show;
        btn.classList.toggle('analyzing', show);
        btn.textContent = show ? '分析中...' : '开始分析';
    }
}

function scrollToResults() {
    const sections = ['baziSection', 'baguaSection', 'compassSection', 'adviceSection', 'suggestionsSection'];
    for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.classList.contains('active')) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
        }
    }
}

function resetAnalysis() {
    currentAnalysis = null;
    const sections = ['baziSection', 'baguaSection', 'compassSection', 'adviceSection', 'suggestionsSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.remove('active');
    });
}