function detectWindowsZoom() {
    try {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const availWidth = screen.availWidth;
        const availHeight = screen.availHeight;
        
        let zoomLevel = Math.round(devicePixelRatio * 100);
        
        const testDiv = document.createElement('div');
        testDiv.style.width = '1in';
        testDiv.style.height = '1in';
        testDiv.style.position = 'absolute';
        testDiv.style.visibility = 'hidden';
        document.body.appendChild(testDiv);
        
        const dpi = testDiv.offsetWidth;
        document.body.removeChild(testDiv);
        
        const standardDPI = 96;
        const scaleFactor = dpi / standardDPI;
        
        if (scaleFactor !== 1) {
            zoomLevel = Math.round(scaleFactor * 100);
        }
        
        return {
            zoom: zoomLevel,
            devicePixelRatio: devicePixelRatio,
            screenResolution: `${screenWidth} × ${screenHeight}`,
            availableArea: `${availWidth} × ${availHeight}`,
            dpi: Math.round(dpi),
            scaleFactor: scaleFactor
        };
    } catch (error) {
        console.error('Ошибка при определении масштаба:', error);
        return null;
    }
}

        // Функция для обновления информации на странице
        function updateZoomInfo() {
            const zoomValueElement = document.getElementById('zoomValue');
            const statusElement = document.getElementById('status');
            
            // Показываем индикатор загрузки
            zoomValueElement.innerHTML = '<span class="loading"></span>';
            
            // Небольшая задержка для плавности анимации
            setTimeout(() => {
                const zoomInfo = detectWindowsZoom();
                
                if (zoomInfo) {
                    // Обновляем основной показатель масштаба
                    zoomValueElement.textContent = `${zoomInfo.zoom}%`;
                    
                    // Обновляем дополнительную информацию
                    document.getElementById('screenResolution').textContent = zoomInfo.screenResolution;
                    document.getElementById('availableArea').textContent = zoomInfo.availableArea;
                    
                    // Обновляем время последнего обновления
                    document.getElementById('lastUpdated').textContent = new Date().toLocaleString('ru-RU');
                    
                    // Показываем статус успеха
                    statusElement.className = 'status success';
                    statusElement.textContent = 'Данные успешно обновлены';
                    statusElement.style.display = 'block';
                    
                    // Скрываем статус через 3 секунды
                    setTimeout(() => {
                        statusElement.style.display = 'none';
                    }, 3000);
                    
                } else {
                    zoomValueElement.textContent = 'Ошибка';
                    statusElement.className = 'status error';
                    statusElement.textContent = 'Не удалось определить масштаб';
                    statusElement.style.display = 'block';
                }
            }, 300);
        }

        // Функция для автоматического обновления при изменении размера окна
        function setupAutoUpdate() {
            let resizeTimeout;
            
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateZoomInfo();
                }, 500); // Обновляем через 500мс после завершения ресайза
            });
            
            // Обновляем при изменении devicePixelRatio (смена масштаба)
            const mediaQuery = window.matchMedia('(resolution: 1dppx)');
            mediaQuery.addListener(() => {
                setTimeout(updateZoomInfo, 100);
            });
        }

        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            // Показываем информационное сообщение
            const statusElement = document.getElementById('status');
            statusElement.className = 'status info';
            statusElement.textContent = 'Определение масштаба Windows...';
            statusElement.style.display = 'block';
            
            // Запускаем определение масштаба
            setTimeout(() => {
                updateZoomInfo();
                setupAutoUpdate();
            }, 500);
        });

        // Дополнительная функция для экспорта данных (если понадобится)
        function getZoomData() {
            const zoomInfo = detectWindowsZoom();
            return {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                ...zoomInfo
            };
        }

        // Добавляем обработчик для сочетания клавиш (Ctrl+R для обновления)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'r') {
                event.preventDefault();
                updateZoomInfo();
            }
        });

        // Функция для вывода в консоль (для отладки)
        function logZoomInfo() {
            console.log('Информация о масштабе Windows:', getZoomData());
        }