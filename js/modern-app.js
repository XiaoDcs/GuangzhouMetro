// 广州地铁查询系统 - 现代化版本
(function() {
    'use strict';
    
    // 全局变量
    var app = {
        gzmtr: null,
        currentMode: 'start',
        svgDoc: null,
        panZoomInstance: null
    };
    
    // 初始化数据
    function initData() {
        // 站点和线路数据（复用原有数据）
        // 一号线
        var line1_T1 = new Terminal('广州东站');
        var line1_T2 = new Terminal('体育中心');
        var line1_T3 = new Terminal('体育西路');
        var line1_T4 = new Terminal('杨箕');
        var line1_T5 = new Terminal('东山口');
        var line1_T6 = new Terminal('烈士陵园');
        var line1_T7 = new Terminal('农讲所');
        var line1_T8 = new Terminal('公园前');
        var line1_T9 = new Terminal('西门口');
        var line1_T10 = new Terminal('陈家祠');
        var line1_T11 = new Terminal('长寿路');
        var line1_T12 = new Terminal('黄沙');
        var line1_T13 = new Terminal('芳村');
        var line1_T14 = new Terminal('花地湾');
        var line1_T15 = new Terminal('坑口');
        var line1_T16 = new Terminal('西朗');
        
        // 二号线
        var line2_T1 = new Terminal('嘉禾望岗');
        var line2_T2 = new Terminal('黄边');
        var line2_T3 = new Terminal('江夏');
        var line2_T4 = new Terminal('萧岗');
        var line2_T5 = new Terminal('白云文化公园');
        var line2_T6 = new Terminal('白云公园');
        var line2_T7 = new Terminal('飞翔公园');
        var line2_T8 = new Terminal('三元里');
        var line2_T9 = new Terminal('广州火车站');
        var line2_T10 = new Terminal('越秀公园');
        var line2_T11 = new Terminal('纪念堂');
        var line2_T12 = new Terminal('公园前');
        var line2_T13 = new Terminal('海珠广场');
        var line2_T14 = new Terminal('市二宫');
        var line2_T15 = new Terminal('江南西');
        var line2_T16 = new Terminal('昌岗');
        var line2_T17 = new Terminal('江泰路');
        var line2_T18 = new Terminal('东晓南');
        var line2_T19 = new Terminal('南洲');
        var line2_T20 = new Terminal('洛溪');
        var line2_T21 = new Terminal('南浦');
        var line2_T22 = new Terminal('会江');
        var line2_T23 = new Terminal('石壁');
        var line2_T24 = new Terminal('广州南站');
        
        // 三号线
        var line3_T1 = new Terminal('天河客运站');
        var line3_T2 = new Terminal('五山');
        var line3_T3 = new Terminal('华师');
        var line3_T4 = new Terminal('岗顶');
        var line3_T5 = new Terminal('石牌桥');
        var line3_T6 = new Terminal('体育西路');
        var line3_T7 = new Terminal('珠江新城');
        var line3_T8 = new Terminal('广州塔');
        var line3_T9 = new Terminal('客村');
        var line3_T10 = new Terminal('大塘');
        var line3_T11 = new Terminal('沥滘');
        var line3_T12 = new Terminal('厦滘');
        var line3_T13 = new Terminal('大石');
        var line3_T14 = new Terminal('汉溪长隆');
        var line3_T15 = new Terminal('市桥');
        var line3_T16 = new Terminal('番禺广场');
        
        // 三号线（北延段）
        var line3plus_T1 = new Terminal('机场南');
        var line3plus_T2 = new Terminal('人和');
        var line3plus_T3 = new Terminal('龙归');
        var line3plus_T4 = new Terminal('嘉禾望岗');
        var line3plus_T5 = new Terminal('白云大道北');
        var line3plus_T6 = new Terminal('永泰');
        var line3plus_T7 = new Terminal('同和');
        var line3plus_T8 = new Terminal('京溪南方医院');
        var line3plus_T9 = new Terminal('梅花园');
        var line3plus_T10 = new Terminal('燕塘');
        var line3plus_T11 = new Terminal('广州东站');
        var line3plus_T12 = new Terminal('林和西');
        var line3plus_T13 = new Terminal('体育西路');
        
        // 四号线
        var line4_T1 = new Terminal('黄村');
        var line4_T2 = new Terminal('车陂');
        var line4_T3 = new Terminal('车陂南');
        var line4_T4 = new Terminal('万胜围');
        var line4_T5 = new Terminal('官洲');
        var line4_T6 = new Terminal('大学城北');
        var line4_T7 = new Terminal('大学城南');
        var line4_T8 = new Terminal('新造');
        var line4_T9 = new Terminal('石碁');
        var line4_T10 = new Terminal('海傍');
        var line4_T11 = new Terminal('低涌');
        var line4_T12 = new Terminal('东涌');
        var line4_T13 = new Terminal('黄阁汽车城');
        var line4_T14 = new Terminal('黄阁');
        var line4_T15 = new Terminal('蕉门');
        var line4_T16 = new Terminal('金洲');
        
        // 五号线
        var line5_T1 = new Terminal('滘口');
        var line5_T2 = new Terminal('坦尾');
        var line5_T3 = new Terminal('中山八');
        var line5_T4 = new Terminal('西场');
        var line5_T5 = new Terminal('西村');
        var line5_T6 = new Terminal('广州火车站');
        var line5_T7 = new Terminal('小北');
        var line5_T8 = new Terminal('淘金');
        var line5_T9 = new Terminal('区庄');
        var line5_T10 = new Terminal('动物园');
        var line5_T11 = new Terminal('杨箕');
        var line5_T12 = new Terminal('五羊邨');
        var line5_T13 = new Terminal('珠江新城');
        var line5_T14 = new Terminal('猎德');
        var line5_T15 = new Terminal('潭村');
        var line5_T16 = new Terminal('员村');
        var line5_T17 = new Terminal('科韵路');
        var line5_T18 = new Terminal('车陂南');
        var line5_T19 = new Terminal('东圃');
        var line5_T20 = new Terminal('三溪');
        var line5_T21 = new Terminal('鱼珠');
        var line5_T22 = new Terminal('大沙地');
        var line5_T23 = new Terminal('大沙东');
        var line5_T24 = new Terminal('文冲');
        
        // 六号线
        var line6_T1 = new Terminal('浔峰岗');
        var line6_T2 = new Terminal('横沙');
        var line6_T3 = new Terminal('沙贝');
        var line6_T4 = new Terminal('河沙');
        var line6_T5 = new Terminal('坦尾');
        var line6_T6 = new Terminal('如意坊');
        var line6_T7 = new Terminal('黄沙');
        var line6_T8 = new Terminal('文化公园');
        var line6_T9 = new Terminal('一德路');
        var line6_T10 = new Terminal('海珠广场');
        var line6_T11 = new Terminal('北京路');
        var line6_T12 = new Terminal('团一大广场');
        var line6_T13 = new Terminal('东湖');
        var line6_T14 = new Terminal('东山口');
        var line6_T15 = new Terminal('区庄');
        var line6_T16 = new Terminal('黄花岗');
        var line6_T17 = new Terminal('沙河顶');
        var line6_T18 = new Terminal('沙河');
        var line6_T19 = new Terminal('天平架');
        var line6_T20 = new Terminal('燕塘');
        var line6_T21 = new Terminal('天河客运站');
        var line6_T22 = new Terminal('长湴');
        
        // 每条路线站点
        var line1Terminals = [line1_T1, line1_T2, line1_T3, line1_T4, line1_T5, line1_T6, line1_T7, line1_T8, line1_T9, line1_T10, line1_T11, line1_T12, line1_T13, line1_T14, line1_T15, line1_T16];
        var line2Terminals = [line2_T1, line2_T2, line2_T3, line2_T4, line2_T5, line2_T6, line2_T7, line2_T8, line2_T9, line2_T10, line2_T11, line1_T8, line2_T13, line2_T14, line2_T15, line2_T16, line2_T17, line2_T18, line2_T19, line2_T20, line2_T21, line2_T22, line2_T23, line2_T24];
        var line3Terminals = [line3_T1, line3_T2, line3_T3, line3_T4, line3_T5, line1_T3, line3_T7, line3_T8, line3_T9, line3_T10, line3_T11, line3_T12, line3_T13, line3_T14, line3_T15, line3_T16];
        var line3plusTerminals = [line3plus_T1, line3plus_T2, line3plus_T3, line2_T1, line3plus_T5, line3plus_T6, line3plus_T7, line3plus_T8, line3plus_T9, line3plus_T10, line1_T1, line3plus_T12, line1_T3];
        var line4Terminals = [line4_T1, line4_T2, line4_T3, line4_T4, line4_T5, line4_T6, line4_T7, line4_T8, line4_T9, line4_T10, line4_T11, line4_T12, line4_T13, line4_T14, line4_T15, line4_T16];
        var line5Terminals = [line5_T1, line5_T2, line5_T3, line5_T4, line5_T5, line2_T9, line5_T7, line5_T8, line5_T9, line5_T10, line1_T4, line5_T12, line3_T7, line5_T14, line5_T15, line5_T16, line5_T17, line4_T3, line5_T19, line5_T20, line5_T21, line5_T22, line5_T23, line5_T24];
        var line6Terminals = [line6_T1, line6_T2, line6_T3, line6_T4, line5_T2, line6_T6, line1_T12, line6_T8, line6_T9, line2_T13, line6_T11, line6_T12, line6_T13, line1_T5, line5_T9, line6_T16, line6_T17, line6_T18, line6_T19, line3plus_T10, line3_T1, line6_T22];
        
        // 各条路线
        var line1 = new Line(line1Terminals, '一号线');
        var line2 = new Line(line2Terminals, '二号线');
        var line3 = new Line(line3Terminals, '三号线');
        var line3plus = new Line(line3plusTerminals, '三号线（北延段）');
        var line4 = new Line(line4Terminals, '四号线');
        var line5 = new Line(line5Terminals, '五号线');
        var line6 = new Line(line6Terminals, '六号线');
        
        // 初始化广州地铁
        app.gzmtr = new MTR('广州地铁');
        app.gzmtr.addLines([line1, line2, line3, line3plus, line4, line5, line6]);
        
        // 填充线路选择器
        var lines = app.gzmtr.getLines();
        $('.line-select').each(function() {
            var $select = $(this);
            lines.forEach(function(line, i) {
                $select.append('<option value="' + i + '">' + line.getName() + '</option>');
            });
        });
    }
    
    // 初始化UI事件
    function initUI() {
        // 线路选择改变时更新站点
        $('.start-line').on('change', function() {
            updateStations($(this).val(), '.start-station');
        });
        
        $('.end-line').on('change', function() {
            updateStations($(this).val(), '.end-station');
        });
        
        // 初始化默认选择
        $('.line-select').trigger('change');
        
        // 搜索按钮点击
        $('.search-btn').on('click', performSearch);
        
        // 模态框关闭
        $('.modal-close, .modal-btn').on('click', function() {
            $('#result-modal').removeClass('active');
        });
        
        // 站点提示点击
        $('.tip-start').on('click', function() {
            app.currentMode = 'start';
            $('.station-tip').removeClass('active');
            $(this).addClass('active');
        });
        
        $('.tip-end').on('click', function() {
            app.currentMode = 'end';
            $('.station-tip').removeClass('active');
            $(this).addClass('active');
        });
    }
    
    // 更新站点选择器
    function updateStations(lineIndex, selector) {
        var line = app.gzmtr.getLine(lineIndex);
        var $select = $(selector);
        
        $select.empty();
        line.getTerminals().forEach(function(terminal, i) {
            $select.append('<option value="' + i + '">' + terminal.getName() + '</option>');
        });
    }
    
    // 执行搜索
    function performSearch() {
        var startLine = $('.start-line').val();
        var endLine = $('.end-line').val();
        var startStation = $('.start-station').val();
        var endStation = $('.end-station').val();
        
        app.gzmtr.reset();
        var route = app.gzmtr.search(
            app.gzmtr.getLine(startLine).getTerminal(startStation),
            app.gzmtr.getLine(endLine).getTerminal(endStation)
        );
        
        // 显示结果
        showResult(route);
        
        // 高亮路径
        highlightRoute(route);
    }
    
    // 显示结果
    function showResult(route) {
        $('.result-desc').html(route.time + '分钟<br/>' + route.desc);
        
        var pathHtml = route.nodes.map(function(desc) {
            return '<div>📍 ' + [desc.start, desc.line, desc.count + '个站', desc.end].join(' → ') + '</div>';
        }).join('');
        
        // 修复路径显示格式
        var pathStations = route.terminals.map(function(terminal) {
            return terminal.name;
        }).join(' → ');
        
        pathHtml += '<div style="margin-top: 15px; font-weight: bold;">🚇 路线：' + pathStations + '</div>';
        
        $('.result-path').html(pathHtml);
        $('#result-modal').addClass('active');
    }
    
    // 初始化SVG交互
    function initSVG() {
        // 等待SVG加载
        var checkCount = 0;
        var checkSVG = setInterval(function() {
            checkCount++;
            var embed = document.getElementById('metro-map');
            
            if (embed && embed.getSVGDocument) {
                try {
                    app.svgDoc = embed.getSVGDocument();
                    if (app.svgDoc) {
                        clearInterval(checkSVG);
                        
                        // 初始化缩略图
                        window.panZoomInstance = thumbnailViewer({
                            mainViewId: 'metro-map',
                            thumbViewId: 'thumbnail-map'
                        });
                        
                        // 设置点击处理
                        setTimeout(function() {
                            setupSVGClickHandlers();
                        }, 500);
                    }
                } catch (e) {
                    // SVG还未加载完成
                }
            }
            
            if (checkCount > 50) {
                clearInterval(checkSVG);
                console.error('SVG加载超时');
            }
        }, 100);
    }
    
    // 设置SVG点击处理
    function setupSVGClickHandlers() {
        if (!app.svgDoc) return;
        
        var textElements = app.svgDoc.getElementsByTagName('text');
        
        for (var i = 0; i < textElements.length; i++) {
            (function(textElement) {
                textElement.style.cursor = 'pointer';
                
                textElement.addEventListener('mouseenter', function() {
                    this.style.fill = '#4ecdc4';
                    this.style.fontSize = '120%';
                });
                
                textElement.addEventListener('mouseleave', function() {
                    this.style.fill = '';
                    this.style.fontSize = '';
                });
                
                textElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectStation(this.textContent.trim());
                });
            })(textElements[i]);
        }
    }
    
    // 选择站点
    function selectStation(stationName) {
        var targetClass = app.currentMode === 'start' ? '.start' : '.end';
        
        // 查找站点所在的线路
        var foundLine = null;
        var foundIndex = null;
        
        app.gzmtr.getLines().forEach(function(line, lineIndex) {
            line.getTerminals().forEach(function(terminal, terminalIndex) {
                if (terminal.getName() === stationName) {
                    foundLine = lineIndex;
                    foundIndex = terminalIndex;
                }
            });
        });
        
        if (foundLine !== null) {
            // 更新选择器
            $(targetClass + '-line').val(foundLine).trigger('change');
            
            setTimeout(function() {
                $(targetClass + '-station').val(foundIndex);
                
                // 自动切换模式
                if (app.currentMode === 'start') {
                    app.currentMode = 'end';
                    $('.tip-end').trigger('click');
                }
            }, 100);
        }
    }
    
    // 高亮路径
    function highlightRoute(route) {
        if (!app.svgDoc) return;
        
        // 清除之前的高亮
        clearHighlight();
        
        // 高亮站点
        var stations = route.terminals.map(function(t) { return t.name; });
        var textElements = app.svgDoc.getElementsByTagName('text');
        
        for (var i = 0; i < textElements.length; i++) {
            var text = textElements[i];
            if (stations.indexOf(text.textContent.trim()) !== -1) {
                text.style.fill = '#ff6b6b';
                text.style.fontWeight = 'bold';
                text.classList.add('highlighted');
            }
        }
    }
    
    // 清除高亮
    function clearHighlight() {
        if (!app.svgDoc) return;
        
        var highlighted = app.svgDoc.querySelectorAll('.highlighted');
        highlighted.forEach(function(elem) {
            elem.style.fill = '';
            elem.style.fontWeight = '';
            elem.classList.remove('highlighted');
        });
    }
    
    // 初始化应用
    $(document).ready(function() {
        initData();
        initUI();
        initSVG();
    });
    
})(); 