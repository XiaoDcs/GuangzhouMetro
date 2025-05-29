// SVG点击注入器 - 直接在SVG内部处理点击事件
var SVGClickInjector = {
    inject: function(svgDoc) {
        console.log('[SVGClickInjector] 开始注入点击处理器');
        
        if (!svgDoc) {
            console.error('[SVGClickInjector] SVG文档为空');
            return;
        }
        
        // 创建一个script元素
        var script = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'script');
        script.textContent = `
            (function() {
                console.log('[SVG内部脚本] 开始执行');
                
                // 获取所有text元素
                var textElements = document.getElementsByTagName('text');
                console.log('[SVG内部脚本] 找到text元素数量:', textElements.length);
                
                // 为每个text元素添加点击事件
                for (var i = 0; i < textElements.length; i++) {
                    (function(elem) {
                        elem.style.cursor = 'pointer';
                        
                        // 添加鼠标悬停效果
                        elem.onmouseover = function() {
                            this.style.fill = '#4ecdc4';
                            this.setAttribute('data-original-size', this.style.fontSize || '');
                            this.style.fontSize = '120%';
                        };
                        
                        elem.onmouseout = function() {
                            this.style.fill = '';
                            this.style.fontSize = this.getAttribute('data-original-size') || '';
                        };
                        
                        elem.onclick = function(e) {
                            e.stopPropagation();
                            var stationName = this.textContent.trim();
                            console.log('[SVG内部脚本] 点击了站点:', stationName);
                            
                            // 添加点击动画效果
                            this.style.fill = '#ff6b6b';
                            var self = this;
                            setTimeout(function() {
                                self.style.fill = '#4ecdc4';
                            }, 200);
                            
                            // 向父窗口发送消息
                            if (window.parent && window.parent !== window) {
                                window.parent.postMessage({
                                    type: 'stationClick',
                                    stationName: stationName
                                }, '*');
                            }
                        };
                    })(textElements[i]);
                }
                
                console.log('[SVG内部脚本] 点击事件绑定完成');
            })();
        `;
        
        // 将script添加到SVG文档
        svgDoc.documentElement.appendChild(script);
        console.log('[SVGClickInjector] 脚本注入完成');
    }
};

// 监听来自SVG的消息
window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'stationClick') {
        console.log('[SVGClickInjector] 收到站点点击消息:', e.data.stationName);
        
        // 调用SVGStationHandler的selectStation方法
        if (typeof SVGStationHandler !== 'undefined' && SVGStationHandler.selectStation) {
            SVGStationHandler.selectStation(e.data.stationName);
        }
    }
}); 