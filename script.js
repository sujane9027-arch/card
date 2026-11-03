// ========== 1. 테마 토글 (Dark / Light Mode) ==========
const themeToggleBtn = document.getElementById('themeToggleBtn');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// 초기 테마 확인 (로컬스토리지 or 시스템 기본값)
const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggleBtn.addEventListener('click', () => {
  const activeTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', targetTheme);
  localStorage.setItem('theme', targetTheme);
  updateThemeIcon(targetTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggleBtn.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// ========== 2. 토스트 알림 메시지 ==========
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  
  toastMsg.textContent = message;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// ========== 3. 클립보드 복사 기능 ==========
function copyToClipboard(text, label = '텍스트') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label}가 클립보드에 복사되었습니다!`);
    }).catch(() => {
      fallbackCopy(text, label);
    });
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label}가 클립보드에 복사되었습니다!`);
  } catch (err) {
    showToast('복사에 실패했습니다.');
  }
  document.body.removeChild(textArea);
}

// ========== 4. 카드 3D 틸트 (Tilt) 마우스 인터랙션 ==========
const card = document.getElementById('businessCard');

if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // 마우스와 카드 중심 사이의 거리 (-1 ~ 1)
    const deltaX = (e.clientX - cardCenterX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - cardCenterY) / (window.innerHeight / 2);
    
    // 최대 회전 각도 (약 9도)
    const rotateY = deltaX * 9;
    const rotateX = -deltaY * 9;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

// ========== 5. 명함 공유하기 (Share) ==========
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: '정수진 | 브랜딩 전문가 디지털 명함',
    text: '브랜딩 전문가 정수진의 디지털 웹명함을 확인해보세요!',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyToClipboard(window.location.href, '명함 링크');
      }
    }
  } else {
    copyToClipboard(window.location.href, '명함 링크');
  }
});

// ========== 6. vCard (.vcf) 연락처 파일 다운로드 ==========
const saveContactBtn = document.getElementById('saveContactBtn');
saveContactBtn.addEventListener('click', () => {
  const contact = {
    lastName: '정',
    firstName: '수진',
    title: '브랜딩 전문가',
    email: 'sujane77@naver.com',
    phone: '010-6526-5275',
    note: '브랜드의 숨겨진 본질을 발견하고 사람의 마음에 깊이 남는 고유한 가치를 디자인합니다.'
  };

  const vCardData = 
`BEGIN:VCARD
VERSION:3.0
N:${contact.lastName};${contact.firstName};;;
FN:${contact.lastName}${contact.firstName}
TITLE:${contact.title}
TEL;TYPE=CELL:${contact.phone}
EMAIL;TYPE=INTERNET:${contact.email}
NOTE:${contact.note}
END:VCARD`;

  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `정수진_브랜딩전문가_연락처.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('연락처 파일(.vcf)이 다운로드되었습니다.');
});
