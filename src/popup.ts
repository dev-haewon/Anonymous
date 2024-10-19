import $, { Cash } from 'cash-dom';
import Awesomplete from 'awesomplete';
import data from '../public/mgalleryDB.json';

class HeaderGUI {
    private isOpen = false;
    private isPaused = false;

    constructor() {
        this.setupAutocomplete();
        this.setupSideNav();
        this.setupPauseResume();
        this.setupDropdown();
        this.setupToggleCheckboxes();
        this.setupMemo();
    }

    /**
     * 검색어 자동완성 설정
     */
    private setupAutocomplete() {
        const searchInput = $('#search')[0] as HTMLInputElement;
        const searchType = $('#search-type');
        const awesomplete = new Awesomplete(searchInput, { minChars: 1 });

        // 검색어 리스트 업데이트
        function updateList() {
            const items =
                searchType.val() === 'id'
                    ? Object.values(data)
                    : Object.keys(data);
            searchInput.value = '';
            awesomplete.list = items;
        }

        searchType.on('change', updateList);
        updateList();
    }

    /**
     * 사이드바 설정
     */
    private setupSideNav() {
        const sideNav = $('#sideNav');
        const main = $('main');
        const more = $('#more');
        const closeBtn = $('button.close');

        const self = this;

        // 사이드바 여는 함수
        function openSideNav() {
            sideNav.addClass('open');
            main.addClass('dimmed');
            self.isOpen = true;
            $(document).on('click.outside', handleOutsideClick);
        }

        // 사이드바 닫는 함수
        function closeSideNav() {
            sideNav.removeClass('open');
            main.removeClass('dimmed');
            self.isOpen = false;
            $(document).off('click.outside');
        }

        // 사이드바 여닫는 토글
        function toggleSideNav(e: MouseEvent) {
            e.stopPropagation();
            self.isOpen ? closeSideNav() : openSideNav();
        }

        // 사이드바 외부 클릭 이벤트 핸들러
        function handleOutsideClick(e: MouseEvent) {
            if (
                !sideNav.is(e.target as HTMLElement) &&
                sideNav.has(e.target as HTMLElement).length === 0 &&
                !more.is(e.target as HTMLElement)
            ) {
                closeSideNav();
            }
        }

        more.on('click', toggleSideNav);
        closeBtn.on('click', closeSideNav);
    }

    /**
     * 일시정지/재개 설정
     */
    private setupPauseResume() {
        const pause = $('#pause');
        const resume = $('#resume');

        const self = this;

        // 일시정지 토글
        function togglePause(e: MouseEvent) {
            e.stopPropagation();
            self.isPaused = !self.isPaused;
            updateUI();
        }

        // UI 업데이트
        function updateUI() {
            if (self.isPaused) {
                pause.hide();
                resume.show();
            } else {
                resume.hide();
                pause.show();
            }
        }

        pause.on('click', togglePause);
        resume.on('click', togglePause);
    }

    /**
     * 드롭다운 설정
     */
    private setupDropdown() {
        // 드롭다운 여닫는 토글 함수
        function toggleDropdown(e: MouseEvent) {
            e.preventDefault();
            const $dropdownContent = $(e.currentTarget as HTMLElement).next(
                '.dropdown-content'
            );

            if ($dropdownContent.hasClass('open')) {
                closeDropdown($dropdownContent);
            } else {
                $('.dropdown-content.open').each((_, el) =>
                    closeDropdown($(el))
                );
                openDropdown($dropdownContent);
            }
        }

        // 드롭다운 여는 함수
        function openDropdown($dropdownContent: Cash) {
            $dropdownContent.addClass('open').css({
                maxHeight: '250px',
                paddingBottom: '250px',
            });
        }

        // 드롭다운 닫는 함수
        function closeDropdown($dropdownContent: Cash) {
            $dropdownContent.removeClass('open').css({
                maxHeight: '0',
                paddingBottom: '0',
            });
        }

        $('.dropdown-btn').on('click', toggleDropdown);
    }

    /**
     * 토글 채크박스들 설정
     */
    private setupToggleCheckboxes() {
        // 토글 체크박스 요소들
        const elements = [
            {
                checkbox: $('input[type="checkbox"]', '#preview'),
                icon: $('i', '#preview'),
            },
            {
                checkbox: $('input[type="checkbox"]', '#user-info'),
                icon: $('i', '#user-info'),
            },
            {
                checkbox: $('input[type="checkbox"]', '#user-tag'),
                icon: $('i', '#user-tag'),
            },
            {
                checkbox: $('input[type="checkbox"]', '#auto-navigation'),
                icon: $('i', '#auto-navigation'),
            },
            {
                checkbox: $('input[type="checkbox"]', '#admin-panel'),
                icon: $('i', '#admin-panel'),
            },
        ];

        elements.forEach(({ checkbox, icon }) => {
            checkbox.on('change', () => {
                const isChecked = checkbox.is(':checked');
                checkbox.css('--tglbg', isChecked ? '#fcac23' : '#f0f0f0');
                icon.toggle(!isChecked);
            });
        });
    }
    /**
     * 메모설정
     */
    private setupMemo() {
        $('#memoSelect span').on('click', function () {
            $('.memoTable tbody').hide();
            $(this).addClass('selected');

            const target = $(this).data('target');
            $(`.memoTable tbody[data-target="${target}"]`).show();
            $('#memoSelect span').not(this).removeClass('selected');
        });

        const addMemo = ($node: Cash) => {
            const $list = $node.find('.memoTable');
            // Further memo adding logic...
        };
    }
}

// 인스턴스 생성 및 초기화
new HeaderGUI();
