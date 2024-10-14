import $, { Cash } from 'cash-dom';
import Awesomplete from 'awesomplete';
import data from '../public/mgalleryDB.json';

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

const search = $('#search');
const clear = $('#clear-button');

search.on('input', function () {
  if ($(this).val()) {
    clear.show();
  } else {
    clear.hide();
  }
});

clear.on('click', function () {
  search.val('');
  $(this).hide();
});

search.on('focus', function () {
  clear.show();
});

search.on('blur', function () {
  setTimeout(() => {
    clear.hide();
  }, 200);
});

const resume = $('#resume');
const pause = $('#pause');

let isOpen: boolean = false;

pause.on('click', (e: MouseEvent) => {
  if (isOpen) {
    e.stopImmediatePropagation();
    close();
  } else {
    pause.hide();
    resume.show();
  }
});

resume.on('click', (e: MouseEvent) => {
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

more.on('click', (e: MouseEvent) => {
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
    if (
      !sideNav.is(e.target) &&
      sideNav.has(e.target).length === 0 &&
      !more.is(e.target)
    ) {
      close();
    }
  });
}

function disable() {
  $(document).off('click.outside');
}

$('.dropdown-btn').on('click', function (e: MouseEvent) {
  e.preventDefault();
  const $dropdownContent = $(this).next('.dropdown-content');

  if ($dropdownContent.hasClass('open')) {
    $dropdownContent
      .removeClass('open')
      .css('max-height', '0')
      .css('padding-bottom', '0');
  } else {
    $('.dropdown-content.open')
      .removeClass('open')
      .css('max-height', '0')
      .css('padding-bottom', '0');

    $dropdownContent
      .addClass('open')
      .css('max-height', '250px')
      .css('padding-bottom', '250px');
  }
});

interface ToggleableElement {
  checkbox: Cash;
  icon: Cash;
}

function toggleCheckbox(element: ToggleableElement) {
  element.checkbox.on('change', function () {
    const isChecked = $(this).is(':checked');
    $(this).css('--tglbg', isChecked ? '#fcac23' : '#f0f0f0');
    element.icon.toggle(!isChecked);
  });
}

const preview: ToggleableElement = {
  checkbox: $('input[type="checkbox"]', '#preview'),
  icon: $('i', '#preview'),
};

const user_info: ToggleableElement = {
  checkbox: $('input[type="checkbox"]', '#user-info'),
  icon: $('i', '#user-info'),
};

const user_tag: ToggleableElement = {
  checkbox: $('input[type="checkbox"]', '#user-tag'),
  icon: $('i', '#user-tag'),
};

const auto_navigation: ToggleableElement = {
  checkbox: $('input[type="checkbox"]', '#auto-navigation'),
  icon: $('i', '#auto-navigation'),
};

const admin_panel: ToggleableElement = {
  checkbox: $('input[type="checkbox"]', '#admin-panel'),
  icon: $('i', '#admin-panel'),
};

toggleCheckbox(preview);
toggleCheckbox(user_info);
toggleCheckbox(user_tag);
toggleCheckbox(auto_navigation);
toggleCheckbox(admin_panel);

const $tableBody = $('#memoTable tbody');

const sampleData = [
  // { key: 'gilDong', value: 'ㅁㄴㅇㄹ' },
  { key: '홍길동', value: '의적' },
  // { key: '123.456', value: 'VPN' },
];
