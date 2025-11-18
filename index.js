function detectWindowsZoom() {
    try {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const availWidth = screen.availWidth;
        const availHeight = screen.availHeight;
        
        const correctedRatio = devicePixelRatio / 1.2;
        const zoom = Math.round(correctedRatio * 100);
        
        return {
            zoom: zoom,
            devicePixelRatio: devicePixelRatio.toFixed(2),
            screenResolution: `${screenWidth} × ${screenHeight}`,
            availableArea: `${availWidth} × ${availHeight}`,
            scaleFactor: correctedRatio.toFixed(2)
        };
    } catch (error) {
        console.error('Ошибка при определении масштаба:', error);
        return null;
    }
}

function updateZoomInfo() {
    const zoomValueElement = document.getElementById('zoomValue');
    const statusElement = document.getElementById('status');
    
    zoomValueElement.innerHTML = '<span class="loading"></span>';
    
    setTimeout(() => {
        const zoomInfo = detectWindowsZoom();
        
        if (zoomInfo) {
            zoomValueElement.textContent = `${zoomInfo.zoom}%`;
            
            document.getElementById('screenResolution').textContent = zoomInfo.screenResolution;
            document.getElementById('availableArea').textContent = zoomInfo.availableArea;
            
            document.getElementById('lastUpdated').textContent = new Date().toLocaleString('ru-RU');
            
            statusElement.className = 'status success';
            statusElement.textContent = 'Данные успешно обновлены';
            statusElement.style.display = 'block';
            
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

function setupAutoUpdate() {
    let resizeTimeout;
    let lastPixelRatio = window.devicePixelRatio;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const currentPixelRatio = window.devicePixelRatio;
            if (currentPixelRatio !== lastPixelRatio) {
                lastPixelRatio = currentPixelRatio;
                updateZoomInfo();
            } else {
                updateZoomInfo();
            }
        }, 300);
    });
    
    const checkPixelRatioChange = () => {
        const currentPixelRatio = window.devicePixelRatio;
        if (currentPixelRatio !== lastPixelRatio) {
            lastPixelRatio = currentPixelRatio;
            updateZoomInfo();
        }
    };
    
    setInterval(checkPixelRatioChange, 1000);
    
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
            setTimeout(updateZoomInfo, 100);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    statusElement.className = 'status info';
    statusElement.textContent = 'Определение масштаба Windows...';
    statusElement.style.display = 'block';
    
    setTimeout(() => {
        updateZoomInfo();
        setupAutoUpdate();
    }, 500);
});

function getZoomData() {
    const zoomInfo = detectWindowsZoom();
    return {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        ...zoomInfo
    };
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        updateZoomInfo();
    }
});

function logZoomInfo() {
    console.log('Информация о масштабе Windows:', getZoomData());
}