// 路径高亮显示处理器
var RouteHighlighter = {
    // SVG文档引用
    svgDoc: null,
    
    // 原始样式存储
    originalStyles: new Map(),
    
    // 线路颜色配置
    lineColors: {
        '一号线': '#F3D03E',
        '二号线': '#00629B', 
        '三号线': '#ECA154',
        '三号线（北延段）': '#ECA154',
        '四号线': '#00843D',
        '五号线': '#C5003E',
        '六号线': '#80225F'
    },
    
    // 初始化
    init: function() {
        console.log('[RouteHighlighter] 初始化开始');
        var self = this;
        var attempts = 0;
        var checkSVGInterval = setInterval(function() {
            attempts++;
            // 优先使用window.mainSVGDoc
            if (window.mainSVGDoc) {
                clearInterval(checkSVGInterval);
                self.svgDoc = window.mainSVGDoc;
                console.log('[RouteHighlighter] 从window.mainSVGDoc获取SVG文档成功');
                return;
            }
            
            var svgElement = document.getElementById('mainView');
            if (svgElement) {
                try {
                    var svgDoc = svgElement.getSVGDocument() || svgElement.contentDocument;
                    if (svgDoc) {
                        clearInterval(checkSVGInterval);
                        self.svgDoc = svgDoc;
                        console.log('[RouteHighlighter] 获取SVG文档成功');
                    }
                } catch (e) {
                    console.error('[RouteHighlighter] 获取SVG文档失败:', e);
                }
            }
            
            if (attempts > 50) {
                clearInterval(checkSVGInterval);
                console.error('[RouteHighlighter] 获取SVG文档超时');
            }
        }, 100);
    },
    
    // 高亮显示路径
    highlightRoute: function(route) {
        console.log('[RouteHighlighter] 开始高亮显示路径');
        console.log('[RouteHighlighter] route对象:', route);
        
        // 如果SVG文档未初始化，尝试获取
        if (!this.svgDoc) {
            if (window.mainSVGDoc) {
                this.svgDoc = window.mainSVGDoc;
                console.log('[RouteHighlighter] 从window.mainSVGDoc获取SVG文档');
            } else {
                var svgElement = document.getElementById('mainView');
                if (svgElement) {
                    this.svgDoc = svgElement.getSVGDocument() || svgElement.contentDocument;
                }
            }
        }
        
        if (!this.svgDoc) {
            console.error('[RouteHighlighter] SVG文档未初始化');
            return;
        }
        
        // 先清除之前的高亮
        this.clearHighlight();
        
        // 获取路径上的所有站点
        var stations = route.terminals.map(function(terminal) {
            return terminal.name;
        });
        console.log('[RouteHighlighter] 路径站点:', stations);
        
        // 高亮站点
        this.highlightStations(stations);
        
        // 高亮路径段
        route.nodes.forEach(function(node) {
            console.log('[RouteHighlighter] 高亮路径段:', node);
            this.highlightSegment(node);
        }.bind(this));
        
        // 特别标记起点和终点
        this.markStartEnd(stations[0], stations[stations.length - 1]);
    },
    
    // 高亮站点
    highlightStations: function(stationNames) {
        console.log('[RouteHighlighter] 高亮站点:', stationNames);
        var textElements = this.svgDoc.getElementsByTagName('text');
        var highlightedCount = 0;
        
        for (var i = 0; i < textElements.length; i++) {
            var text = textElements[i];
            var stationName = text.textContent.trim();
            
            if (stationNames.indexOf(stationName) !== -1) {
                // 保存原始样式
                if (!this.originalStyles.has(text)) {
                    this.originalStyles.set(text, {
                        fill: text.style.fill || text.getAttribute('fill') || '',
                        fontSize: text.style.fontSize || '',
                        fontWeight: text.style.fontWeight || ''
                    });
                }
                
                // 应用高亮样式
                text.style.fill = '#FF6B6B';
                text.style.fontSize = '1.3em';
                text.style.fontWeight = 'bold';
                
                // 添加动画效果
                this.addPulseAnimation(text);
                highlightedCount++;
            }
        }
        console.log('[RouteHighlighter] 高亮了' + highlightedCount + '个站点');
    },
    
    // 高亮路径段
    highlightSegment: function(segment) {
        // 这里需要根据实际的SVG结构来实现
        // 通常需要找到连接两个站点的路径元素
        var lineColor = this.lineColors[segment.line] || '#333';
        
        // 查找包含线路信息的路径元素
        var paths = this.svgDoc.getElementsByTagName('path');
        var lines = this.svgDoc.getElementsByTagName('line');
        
        // 这里简化处理，实际需要根据SVG的具体结构来匹配路径
        // 可以通过站点坐标来计算路径
    },
    
    // 标记起点和终点
    markStartEnd: function(startStation, endStation) {
        console.log('[RouteHighlighter] 标记起点:', startStation, '终点:', endStation);
        var textElements = this.svgDoc.getElementsByTagName('text');
        
        for (var i = 0; i < textElements.length; i++) {
            var text = textElements[i];
            var stationName = text.textContent.trim();
            
            if (stationName === startStation) {
                // 起点标记
                this.addMarker(text, 'start');
            } else if (stationName === endStation) {
                // 终点标记
                this.addMarker(text, 'end');
            }
        }
    },
    
    // 添加标记
    addMarker: function(textElement, type) {
        var bbox = textElement.getBBox();
        var marker = this.svgDoc.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        marker.setAttribute('cx', bbox.x + bbox.width / 2);
        marker.setAttribute('cy', bbox.y + bbox.height / 2);
        marker.setAttribute('r', '15');
        marker.setAttribute('fill', type === 'start' ? '#4ECDC4' : '#FF6B6B');
        marker.setAttribute('fill-opacity', '0.3');
        marker.setAttribute('class', 'route-marker');
        
        // 添加动画
        var animate = this.svgDoc.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '15;25;15');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('repeatCount', 'indefinite');
        marker.appendChild(animate);
        
        textElement.parentNode.insertBefore(marker, textElement);
    },
    
    // 添加脉冲动画
    addPulseAnimation: function(element) {
        // 创建CSS动画
        if (!this.svgDoc.getElementById('pulseStyle')) {
            var style = this.svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
            style.id = 'pulseStyle';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
                .pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                }
            `;
            this.svgDoc.documentElement.appendChild(style);
        }
        
        element.classList.add('pulse');
    },
    
    // 清除高亮
    clearHighlight: function() {
        console.log('[RouteHighlighter] 清除高亮');
        if (!this.svgDoc) return;
        
        // 恢复文本样式
        this.originalStyles.forEach(function(style, element) {
            element.style.fill = style.fill;
            element.style.fontSize = style.fontSize;
            element.style.fontWeight = style.fontWeight;
            element.classList.remove('pulse');
        });
        this.originalStyles.clear();
        
        // 移除标记
        var markers = this.svgDoc.querySelectorAll('.route-marker');
        markers.forEach(function(marker) {
            marker.remove();
        });
    }
};

// 初始化
$(document).ready(function() {
    console.log('[RouteHighlighter] document ready，准备初始化');
    RouteHighlighter.init();
}); 

// 监听SVG加载完成事件
window.addEventListener('mainSVGLoaded', function(e) {
    console.log('[RouteHighlighter] 收到mainSVGLoaded事件');
    if (e.detail && e.detail.svgDoc) {
        RouteHighlighter.svgDoc = e.detail.svgDoc;
        console.log('[RouteHighlighter] 从事件获取到SVG文档');
    }
}); 