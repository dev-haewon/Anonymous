const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); // 파일 시스템 모듈

// 크롤링할 URL 설정 (디시인사이드 마이너 갤러리 목록 페이지)
const url = 'https://gall.dcinside.com/m';

async function main() {
  try {
    // 웹 페이지 데이터 가져오기
    const { data } = await axios.get(url);
    
    const $ = cheerio.load(data);

    const mgalleryDB = {}; // 객체로 데이터 저장

    function getMgalleryData($selector) {
        // ul 요소에서 바로 li > a 요소들을 찾아 순환
        $($selector).each((_, element) => {
          const $target = $(element);
          const href = $target.attr('href');
    
          // href가 유효한지 확인
          if (href) {
            const mgalleryID = href.split('/').pop().replace('?id=', '') || '';
    
            // span 태그를 제외한 텍스트 추출
            $target.find('span').remove(); // span 태그를 제거
            const mgalleryName = $target.text().trim() || 'Unknown'; // span 제거 후 텍스트 추출
    
            // 갤러리 이름을 키, 갤러리 ID를 값으로 저장
            mgalleryDB[mgalleryName] = mgalleryID;
          }
        });    
    }

    getMgalleryData('#heung_list_ul li > a')
    getMgalleryData('#heung_list_ul_2 li > a')
    getMgalleryData('#heung_list_ul_3 li > a')


    // 결과를 JSON 파일로 저장
    fs.writeFileSync('mgalleryDB.json', JSON.stringify(mgalleryDB, null, 2), 'utf-8'); // JSON 파일로 저장

    console.log('데이터가 파일로 저장되었습니다.');
  } catch (error) {
    console.error('Error fetching the data:', error);
  }
}

main();
