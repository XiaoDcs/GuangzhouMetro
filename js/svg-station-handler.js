// SVG站点点击处理器
var SVGStationHandler = {
    // 当前选择模式：'start' 或 'end'
    currentMode: 'start',
    svgPanZoomInstance: null,
    
    // 初始化
    init: function() {
        console.log('[SVGStationHandler] 初始化开始');
        this.bindEvents();
        this.initSVGClickHandler();
    },
    
    // 绑定事件
    bindEvents: function() {
        console.log('[SVGStationHandler] 绑定事件');
        // 添加模式切换按钮
        this.addModeToggleButtons();
    },
    
    // 添加模式切换按钮
    addModeToggleButtons: function() {
        console.log('[SVGStationHandler] 添加模式切换按钮');
        // 检查是否已经添加过提示，避免重复添加
        if ($('.station-select-tip').length === 0) {
            // 在起点和终点输入区域添加提示
            $('.start.No2_body').prepend('<div class="station-select-tip mdui-text-color-teal">点击地图选择起点站</div>');
            $('.end.No2_body').prepend('<div class="station-select-tip mdui-text-color-pink">点击地图选择终点站</div>');
        }
        
        // 为起点区域添加点击事件
        $('.start.No2_body').off('click').on('click', function() {
            console.log('[SVGStationHandler] 切换到起点选择模式');
            SVGStationHandler.currentMode = 'start';
            $('.start .station-select-tip').addClass('active');
            $('.end .station-select-tip').removeClass('active');
            mdui.snackbar({
                message: '请在地图上点击选择起点站',
                position: 'top'
            });
        });
        
        // 为终点区域添加点击事件
        $('.end.No2_body').off('click').on('click', function() {
            console.log('[SVGStationHandler] 切换到终点选择模式');
            SVGStationHandler.currentMode = 'end';
            $('.end .station-select-tip').addClass('active');
            $('.start .station-select-tip').removeClass('active');
            mdui.snackbar({
                message: '请在地图上点击选择终点站',
                position: 'top'
            });
        });
    },
    
    // 初始化SVG点击处理
    initSVGClickHandler: function() {
        console.log('[SVGStationHandler] 开始初始化SVG点击处理');
        var self = this;
        var attempts = 0;
        
        // 等待SVG加载完成
        var checkSVGInterval = setInterval(function() {
            attempts++;
            console.log('[SVGStationHandler] 尝试获取SVG文档，第' + attempts + '次');
            
            var embedElement = document.getElementById('mainView');
            console.log('[SVGStationHandler] embed元素:', embedElement);
            
            if (embedElement) {
                try {
                    // 尝试获取SVG文档
                    var svgDoc = embedElement.getSVGDocument();
                    if (!svgDoc && embedElement.contentDocument) {
                        svgDoc = embedElement.contentDocument;
                    }
                    
                    console.log('[SVGStationHandler] SVG文档:', svgDoc);
                    
                    if (svgDoc) {
                        clearInterval(checkSVGInterval);
                        console.log('[SVGStationHandler] SVG文档获取成功');
                        
                        // 检查是否有svg-pan-zoom实例
                        if (window.main) {
                            console.log('[SVGStationHandler] 检测到svg-pan-zoom实例');
                            self.svgPanZoomInstance = window.main;
                        }
                        
                        self.setupSVGClickHandlers(svgDoc);
                    }
                } catch (e) {
                    console.error('[SVGStationHandler] 获取SVG文档失败:', e);
                }
            }
            
            // 超时处理
            if (attempts > 50) {
                clearInterval(checkSVGInterval);
                console.error('[SVGStationHandler] 获取SVG文档超时');
            }
        }, 100);
    },
    
    // 设置SVG点击处理器
    setupSVGClickHandlers: function(svgDoc) {
        console.log('[SVGStationHandler] 开始设置SVG点击处理器');
        var self = this;
        var textElements = svgDoc.getElementsByTagName('text');
        console.log('[SVGStationHandler] 找到text元素数量:', textElements.length);
        
        // 如果有svg-pan-zoom，需要暂时禁用它来处理点击
        var enableClickThrough = function() {
            if (self.svgPanZoomInstance) {
                console.log('[SVGStationHandler] 暂时禁用平移功能');
                self.svgPanZoomInstance.disablePan();
            }
        };
        
        var disableClickThrough = function() {
            if (self.svgPanZoomInstance) {
                console.log('[SVGStationHandler] 重新启用平移功能');
                self.svgPanZoomInstance.enablePan();
            }
        };
        
        // 为整个SVG文档添加一个事件委托
        svgDoc.addEventListener('click', function(e) {
            console.log('[SVGStationHandler] SVG文档点击事件，目标:', e.target);
            if (e.target.tagName === 'text') {
                e.preventDefault();
                e.stopPropagation();
                var stationName = e.target.textContent.trim();
                console.log('[SVGStationHandler] 通过事件委托点击了站点:', stationName);
                self.selectStation(stationName);
            }
        }, true); // 使用捕获阶段
        
        // 仍然为每个text元素添加样式
        for (var i = 0; i < textElements.length; i++) {
            (function(textElement, index) {
                // 添加鼠标悬停效果
                textElement.style.cursor = 'pointer';
                textElement.setAttribute('data-clickable', 'true');
                
                textElement.addEventListener('mouseenter', function(e) {
                    console.log('[SVGStationHandler] 鼠标进入text元素' + index + ':', this.textContent);
                    this.style.fill = '#4ecdc4';
                    this.style.fontSize = '1.2em';
                    enableClickThrough();
                });
                
                textElement.addEventListener('mouseleave', function(e) {
                    this.style.fill = '';
                    this.style.fontSize = '';
                    disableClickThrough();
                });
                
                // 添加点击事件
                textElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var stationName = this.textContent.trim();
                    console.log('[SVGStationHandler] 点击了站点:', stationName);
                    self.selectStation(stationName);
                });
                
                // 也监听mousedown事件，以防click被拦截
                textElement.addEventListener('mousedown', function(e) {
                    if (e.button === 0) { // 左键
                        e.preventDefault();
                        e.stopPropagation();
                        var stationName = this.textContent.trim();
                        console.log('[SVGStationHandler] mousedown事件 - 站点:', stationName);
                    }
                });
            })(textElements[i], i);
        }
        
        console.log('[SVGStationHandler] SVG点击处理器设置完成');
    },
    
    // 选择站点
    selectStation: function(stationName) {
        console.log('[SVGStationHandler] selectStation被调用，站点名:', stationName);
        console.log('[SVGStationHandler] 当前模式:', this.currentMode);
        
        // 查找该站点所在的线路
        var foundLine = null;
        var foundTerminalIndex = null;
        var targetSelector = this.currentMode === 'start' ? '.start' : '.end';
        
        // 遍历所有线路查找站点
        gzmtr.getLines().forEach(function(line, lineIndex) {
            line.getTerminals().forEach(function(terminal, terminalIndex) {
                if (terminal.getName() === stationName) {
                    foundLine = lineIndex;
                    foundTerminalIndex = terminalIndex;
                    console.log('[SVGStationHandler] 找到站点 - 线路:', lineIndex, '站点索引:', terminalIndex);
                }
            });
        });
        
        if (foundLine !== null && foundTerminalIndex !== null) {
            console.log('[SVGStationHandler] 开始设置选择器');
            
            // 先设置线路
            var $lineSelect = $(targetSelector + ' .line');
            $lineSelect.val(foundLine);
            
            // 手动触发change事件更新站点列表
            $lineSelect.trigger('change');
            
            // 等待站点列表更新后再设置站点
            setTimeout(function() {
                var $terminalSelect = $(targetSelector + ' .terminal');
                $terminalSelect.val(foundTerminalIndex);
                
                // 尝试多种方式更新select组件
                try {
                    // 方法1：使用现有实例
                    if (SVGStationHandler.currentMode === 'start' && window.inst1) {
                        window.inst1.handleUpdate();
                    } else if (SVGStationHandler.currentMode === 'end' && window.inst2) {
                        window.inst2.handleUpdate();
                    }
                    
                    // 方法2：重新初始化MDUI的Select组件
                    var $selectElements = $(targetSelector + ' select');
                    $selectElements.each(function() {
                        if (this.mdui && this.mdui.Select) {
                            this.mdui.Select.handleUpdate();
                        }
                    });
                    
                    // 方法3：手动触发MDUI的mutation
                    if (typeof mdui !== 'undefined') {
                        mdui.mutation();
                    }
                } catch (e) {
                    console.error('[SVGStationHandler] 更新select失败:', e);
                }
                
                console.log('[SVGStationHandler] 选择器设置完成');
                
                // 显示成功提示
                mdui.snackbar({
                    message: (SVGStationHandler.currentMode === 'start' ? '起点' : '终点') + '已设置为：' + stationName,
                    position: 'top'
                });
                
                // 自动切换到另一个模式
                if (SVGStationHandler.currentMode === 'start') {
                    SVGStationHandler.currentMode = 'end';
                    $('.end .station-select-tip').addClass('active');
                    $('.start .station-select-tip').removeClass('active');
                    console.log('[SVGStationHandler] 自动切换到终点选择模式');
                }
            }, 300); // 增加延迟时间到300ms
        } else {
            console.log('[SVGStationHandler] 未找到站点:', stationName);
            mdui.snackbar({
                message: '未找到站点：' + stationName,
                position: 'top'
            });
        }
    }
};

// 页面加载完成后初始化
$(document).ready(function() {
    console.log('[SVGStationHandler] 页面加载完成，准备初始化');
    setTimeout(function() {
        console.log('[SVGStationHandler] 延迟初始化开始');
        SVGStationHandler.init();
    }, 1000); // 增加延迟时间确保SVG完全加载
}); 

// 监听SVG加载完成事件
window.addEventListener('mainSVGLoaded', function(e) {
    console.log('[SVGStationHandler] 收到mainSVGLoaded事件');
    if (e.detail && e.detail.svgDoc) {
        console.log('[SVGStationHandler] 从事件获取到SVG文档，直接设置点击处理器');
        SVGStationHandler.setupSVGClickHandlers(e.detail.svgDoc);
    }
}); 