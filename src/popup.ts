import $ from "cash-dom";
import Awesomplete from 'awesomplete';
import data from "../public/mgalleryDB.json";

// Awesomplete 인스턴스를 전역에서 사용
const searchInput = $('#search')[0] as HTMLInputElement;
const awesomplete = new Awesomplete(searchInput, {
    minChars: 1,
});

// 검색 유형 선택 시 자동완성 목록 업데이트
$('#search-type').on('change', choose);

function choose() {
    const searchType = $('#search-type').val() as string;
    $('#search').val('');

    let items: string[] = [];
    
    if (searchType === 'id') {
        items = Object.values(data);
    } else {
        items = Object.keys(data);
    }

    // Awesomplete 인스턴스의 목록 업데이트
    awesomplete.list = items;
}

// 초기 목록 설정
choose();

const pause = $('#pause');
const resume = $('#resume');

let isOpen: boolean = false;

pause.on('click', (e) => {
    if (isOpen) {
        e.stopImmediatePropagation();
        close(); 
    } else {
        pause.hide();
        resume.show();
    }
});

resume.on('click', (e) => {
    if (isOpen) {
        e.stopImmediatePropagation();
        close(); 
    } else {
        resume.hide();
        pause.show();
    }
});

const main = $('main');
const more = $('#more');
const sideNav = $('#sideNav');
const closeBtn = $('button.close');

more.on('click', (e) => {
    if (isOpen) {
        e.stopImmediatePropagation();
        close();
    } else {
        e.stopPropagation();
        sideNav.addClass('open');
        main.addClass('dimmed');
        isOpen = true;
        enable();
    }
});

closeBtn.on('click', close);

function close() {
    sideNav.removeClass('open');
    main.removeClass('dimmed');
    isOpen = false;
    disable();
}

function enable() {
    $(document).on('click.outside', (e) => {
        if (!sideNav.is(e.target) && sideNav.has(e.target).length === 0 && !more.is(e.target) ) {
            close();
        }
    })
}

function disable() {
    $(document).off('click.outside');
}
